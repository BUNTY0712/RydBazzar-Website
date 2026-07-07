export interface RegisterRequest {
  name: string
  mobile: string
  password: string
  password_confirmation: string
  role: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: any
}

export interface Driver {
  id: string
  name: string
  mobile: string
  role: string
}


export interface CreateProjectRequest {
  project_name: string
  project_cost: number
  project_state: string
  project_location: string
  project_status: string
  project_timeline: string
  client_id: number
  employees: number[]
}

export interface CreateProjectResponse {
  message: string
  data?: any
}

export interface State {
  id: number
  country_id: number
  name: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone_number: string
  created_at: string
  updated_at: string
}

export interface GetClientsResponse {
  message: string
  data: Client[]
}


export interface Employee {
  id: number
  name: string
  email: string
  phone_number: string
  profile_image: string
  status: string
  created_at: string
  updated_at: string
}

export interface GetEmployeesResponse {
  message: string
  data: Employee[]
}


export interface Project {
  id: number
  project_name: string
  project_cost: string
  project_state: string
  project_location: string
  project_status: string
  project_timeline: string
  project_gallery: string | null
  client_id: number
  created_at: string
}

export interface GetProjectsResponse {
  message: string
  data: Project[]
}

export interface CreateClientRequest {
  name: string
  email: string
  phone_number: string
  password: string
}

export interface CreateClientResponse {
  message: string
  data: {
    id: number
    name: string
    email: string
    phone_number: string
    created_at: string
    updated_at: string
  }
}

export interface Client {
  id: number
  name: string
  email: string
  phone_number: string
  created_at: string
  updated_at: string
}

export interface GetClientsResponse {
  message: string
  data: Client[] // Matches the array structure in the screenshot
}

export interface CreateEmployeeRequest {
  name: string
  email: string
  phone_number: string
  status: string
  profile_image: File | string
}

export interface CreateEmployeeResponse {
  message: string
  data: any // Adjust based on your API response structure
}

export interface UpdateProjectRequest {
  id: number
  project_name: string
  project_cost: number
  project_state: string
  project_location: string
  project_status: string
  project_timeline: string
  client_id: number
  employees: number[]
}

export interface UpdateProjectResponse {
  message: string
  data: any
}

export interface UpdateClientRequest {
  id: number
  name: string
  email: string
  phone_number: string
}

export interface UpdateClientResponse {
  message: string
  data: any
}