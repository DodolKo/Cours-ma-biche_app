import { supabase } from './supabase'

/**
 * Service de synchronisation hors ligne pour l'application Running
 * Gère la mise en cache et la synchronisation des données avec Supabase
 */
class OfflineSyncService {
  constructor() {
    this.isOnline = navigator.onLine
    this.pendingOperations = []
    this.setupEventListeners()
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncPendingOperations()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  /**
   * Ajoute une opération à la queue de synchronisation
   * @param {string} operation - Type d'opération (insert, update, delete)
   * @param {string} table - Nom de la table Supabase
   * @param {object} data - Données à synchroniser
   * @param {object} options - Options supplémentaires
   */
  addPendingOperation(operation, table, data, options = {}) {
    const operationData = {
      id: Date.now() + Math.random(),
      operation,
      table,
      data,
      options,
      timestamp: new Date().toISOString()
    }

    this.pendingOperations.push(operationData)
    this.savePendingOperations()
    
    console.log(`Opération ${operation} ajoutée à la queue:`, operationData)
  }

  /**
   * Sauvegarde les opérations en attente dans localStorage
   */
  savePendingOperations() {
    try {
      localStorage.setItem('pwa-pending-operations', JSON.stringify(this.pendingOperations))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des opérations en attente:', error)
    }
  }

  /**
   * Charge les opérations en attente depuis localStorage
   */
  loadPendingOperations() {
    try {
      const stored = localStorage.getItem('pwa-pending-operations')
      if (stored) {
        this.pendingOperations = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des opérations en attente:', error)
      this.pendingOperations = []
    }
  }

  /**
   * Synchronise toutes les opérations en attente
   */
  async syncPendingOperations() {
    if (!this.isOnline || this.pendingOperations.length === 0) {
      return
    }

    console.log(`Synchronisation de ${this.pendingOperations.length} opérations...`)

    const operations = [...this.pendingOperations]
    this.pendingOperations = []

    for (const operation of operations) {
      try {
        await this.executeOperation(operation)
        console.log(`Opération ${operation.id} synchronisée avec succès`)
      } catch (error) {
        console.error(`Erreur lors de la synchronisation de l'opération ${operation.id}:`, error)
        // Remettre l'opération en queue si elle échoue
        this.pendingOperations.push(operation)
      }
    }

    this.savePendingOperations()
  }

  /**
   * Exécute une opération spécifique
   * @param {object} operation - Opération à exécuter
   */
  async executeOperation(operation) {
    const { operation: op, table, data, options } = operation

    switch (op) {
      case 'insert':
        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert(data)
        if (insertError) throw insertError
        break

      case 'update':
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data)
          .match(options.where || {})
        if (updateError) throw updateError
        break

      case 'delete':
        const { data: deleteData, error: deleteError } = await supabase
          .from(table)
          .delete()
          .match(options.where || {})
        if (deleteError) throw deleteError
        break

      default:
        throw new Error(`Type d'opération non supporté: ${op}`)
    }
  }

  /**
   * Méthode utilitaire pour insérer des données avec gestion hors ligne
   * @param {string} table - Nom de la table
   * @param {object} data - Données à insérer
   */
  async insert(table, data) {
    if (this.isOnline) {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .insert(data)
          .select()
        
        if (error) throw error
        return result
      } catch (error) {
        // En cas d'erreur, ajouter à la queue
        this.addPendingOperation('insert', table, data)
        throw error
      }
    } else {
      // Hors ligne, ajouter à la queue
      this.addPendingOperation('insert', table, data)
      return { offline: true, queued: true }
    }
  }

  /**
   * Méthode utilitaire pour mettre à jour des données avec gestion hors ligne
   * @param {string} table - Nom de la table
   * @param {object} data - Données à mettre à jour
   * @param {object} where - Conditions de mise à jour
   */
  async update(table, data, where) {
    if (this.isOnline) {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .update(data)
          .match(where)
          .select()
        
        if (error) throw error
        return result
      } catch (error) {
        // En cas d'erreur, ajouter à la queue
        this.addPendingOperation('update', table, data, { where })
        throw error
      }
    } else {
      // Hors ligne, ajouter à la queue
      this.addPendingOperation('update', table, data, { where })
      return { offline: true, queued: true }
    }
  }

  /**
   * Méthode utilitaire pour supprimer des données avec gestion hors ligne
   * @param {string} table - Nom de la table
   * @param {object} where - Conditions de suppression
   */
  async delete(table, where) {
    if (this.isOnline) {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .delete()
          .match(where)
          .select()
        
        if (error) throw error
        return result
      } catch (error) {
        // En cas d'erreur, ajouter à la queue
        this.addPendingOperation('delete', table, {}, { where })
        throw error
      }
    } else {
      // Hors ligne, ajouter à la queue
      this.addPendingOperation('delete', table, {}, { where })
      return { offline: true, queued: true }
    }
  }

  /**
   * Initialise le service (à appeler au démarrage de l'app)
   */
  init() {
    this.loadPendingOperations()
    if (this.isOnline) {
      this.syncPendingOperations()
    }
  }

  /**
   * Retourne le nombre d'opérations en attente
   */
  getPendingCount() {
    return this.pendingOperations.length
  }

  /**
   * Vide la queue des opérations en attente
   */
  clearPendingOperations() {
    this.pendingOperations = []
    this.savePendingOperations()
  }
}

// Instance singleton
export const offlineSync = new OfflineSyncService()

// Initialisation automatique
offlineSync.init()

