<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">Mon Profil</h3>
      <button
        @click="$emit('edit')"
        class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
      >
        Modifier
      </button>
    </div>

    <div class="space-y-4">
      <!-- Informations personnelles -->
      <div>
        <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Informations personnelles</h4>
        <div class="mt-2 space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Nom complet</span>
            <span class="text-sm font-medium text-gray-900">
              {{ fullName || 'Non renseigné' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Email</span>
            <span class="text-sm font-medium text-gray-900">{{ profile.email }}</span>
          </div>
          <div v-if="profile.birth_date" class="flex justify-between">
            <span class="text-sm text-gray-600">Âge</span>
            <span class="text-sm font-medium text-gray-900">{{ age }} ans</span>
          </div>
          <div v-if="profile.gender" class="flex justify-between">
            <span class="text-sm text-gray-600">Genre</span>
            <span class="text-sm font-medium text-gray-900">{{ genderLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Informations physiques -->
      <div v-if="hasPhysicalInfo" class="pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Informations physiques</h4>
        <div class="mt-2 space-y-2">
          <div v-if="profile.weight" class="flex justify-between">
            <span class="text-sm text-gray-600">Poids</span>
            <span class="text-sm font-medium text-gray-900">{{ profile.weight }} kg</span>
          </div>
          <div v-if="profile.height" class="flex justify-between">
            <span class="text-sm text-gray-600">Taille</span>
            <span class="text-sm font-medium text-gray-900">{{ profile.height }} cm</span>
          </div>
          <div v-if="bmi" class="flex justify-between">
            <span class="text-sm text-gray-600">IMC</span>
            <span class="text-sm font-medium text-gray-900">
              {{ bmi }} 
              <span :class="bmiColorClass" class="text-xs ml-1">
                ({{ bmiCategory }})
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Activité -->
      <div v-if="profile.activity_level" class="pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Activité</h4>
        <div class="mt-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Niveau d'activité</span>
            <span class="text-sm font-medium text-gray-900">{{ activityLevelLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Placeholder pour futures informations -->
      <div class="pt-4 border-t border-gray-200">
        <div class="grid grid-cols-2 gap-4 text-center">
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">0</div>
            <div class="text-xs text-gray-500">Courses</div>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">0</div>
            <div class="text-xs text-gray-500">km parcourus</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['edit'])

// Computed
const fullName = computed(() => {
  if (!props.profile) return ''
  return `${props.profile.first_name || ''} ${props.profile.last_name || ''}`.trim()
})

const age = computed(() => {
  if (!props.profile?.birth_date) return null
  const birthDate = new Date(props.profile.birth_date)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

const bmi = computed(() => {
  if (!props.profile?.weight || !props.profile?.height) return null
  const heightInM = props.profile.height / 100
  return (props.profile.weight / (heightInM * heightInM)).toFixed(1)
})

const bmiCategory = computed(() => {
  if (!bmi.value) return ''
  const bmiNum = parseFloat(bmi.value)
  
  if (bmiNum < 18.5) return 'Insuffisant'
  if (bmiNum < 25) return 'Normal'
  if (bmiNum < 30) return 'Surpoids'
  return 'Obésité'
})

const bmiColorClass = computed(() => {
  const category = bmiCategory.value
  switch (category) {
    case 'Insuffisant': return 'text-blue-600'
    case 'Normal': return 'text-green-600'
    case 'Surpoids': return 'text-yellow-600'
    case 'Obésité': return 'text-red-600'
    default: return 'text-gray-600'
  }
})

const genderLabel = computed(() => {
  const genderMap = {
    'male': 'Homme',
    'female': 'Femme',
    'other': 'Autre'
  }
  return genderMap[props.profile?.gender] || props.profile?.gender
})

const activityLevelLabel = computed(() => {
  const activityMap = {
    'sedentary': 'Sédentaire',
    'light': 'Léger',
    'moderate': 'Modéré',
    'active': 'Actif',
    'very_active': 'Très actif'
  }
  return activityMap[props.profile?.activity_level] || props.profile?.activity_level
})

const hasPhysicalInfo = computed(() => {
  return props.profile?.weight || props.profile?.height
})
</script>
