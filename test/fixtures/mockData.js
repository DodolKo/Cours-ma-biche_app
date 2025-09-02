// Données de test et mocks pour les tests
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    first_name: 'Jean',
    last_name: 'Dupont',
    display_name: 'Jean D.'
  }
}

export const mockHealthData = {
  id: 'test-health-id',
  user_id: 'test-user-id',
  birth_date: '1990-01-01',
  weight: 70.5,
  height: 175.0,
  gender: 'male',
  activity_level: 'moderate',
  medical_conditions: [],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

export const mockRun = {
  id: 'test-run-id',
  user_id: 'test-user-id',
  distance: 5.0,
  duration: 1800, // 30 minutes
  pace: 6.0, // 6 min/km
  calories: 300,
  elevation_gain: 50.0,
  run_date: '2024-01-01T10:00:00Z',
  notes: 'Belle course matinale',
  created_at: '2024-01-01T10:00:00Z'
}

export const mockGoal = {
  id: 'test-goal-id',
  user_id: 'test-user-id',
  title: 'Courir 100km ce mois',
  description: 'Objectif mensuel de distance',
  goal_type: 'distance',
  target_value: 100.0,
  current_value: 25.0,
  unit: 'km',
  target_date: '2024-01-31',
  is_active: true,
  is_completed: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}
