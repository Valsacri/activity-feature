"use client"

import React, { createContext, useContext, useReducer, type ReactNode } from "react"
import {
  type Person,
  type Equipment,
  type FinancialItem,
  type CommunicationItem,
  type SportEvent,
  type Sponsor,
  type SponsorshipProposal,
  initialPeople,
  initialEquipment,
  initialFinancials,
  initialCommunication,
  initialEvents,
  initialSponsors,
  initialProposals,
} from "./data"

// ==========================================
// STATE
// ==========================================

export interface AppState {
  people: Person[]
  equipment: Equipment[]
  financials: FinancialItem[]
  communication: CommunicationItem[]
  events: SportEvent[]
  sponsors: Sponsor[]
  proposals: SponsorshipProposal[]
}

const initialState: AppState = {
  people: initialPeople,
  equipment: initialEquipment,
  financials: initialFinancials,
  communication: initialCommunication,
  events: initialEvents,
  sponsors: initialSponsors,
  proposals: initialProposals,
}

// ==========================================
// ACTIONS
// ==========================================

type Action =
  // People
  | { type: "ADD_PERSON"; payload: Person }
  | { type: "UPDATE_PERSON"; payload: Person }
  | { type: "DELETE_PERSON"; payload: string }
  // Equipment
  | { type: "ADD_EQUIPMENT"; payload: Equipment }
  | { type: "UPDATE_EQUIPMENT"; payload: Equipment }
  | { type: "DELETE_EQUIPMENT"; payload: string }
  // Financials
  | { type: "ADD_FINANCIAL"; payload: FinancialItem }
  | { type: "UPDATE_FINANCIAL"; payload: FinancialItem }
  | { type: "DELETE_FINANCIAL"; payload: string }
  // Communication
  | { type: "ADD_COMMUNICATION"; payload: CommunicationItem }
  | { type: "UPDATE_COMMUNICATION"; payload: CommunicationItem }
  | { type: "DELETE_COMMUNICATION"; payload: string }
  // Events
  | { type: "ADD_EVENT"; payload: SportEvent }
  | { type: "UPDATE_EVENT"; payload: SportEvent }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "ASSIGN_RESOURCE"; payload: { eventId: string; resourceType: "people" | "equipment" | "financials" | "communication"; resourceId: string } }
  | { type: "UNASSIGN_RESOURCE"; payload: { eventId: string; resourceType: "people" | "equipment" | "financials" | "communication"; resourceId: string } }
  // Sponsors
  | { type: "ADD_SPONSOR"; payload: Sponsor }
  | { type: "UPDATE_SPONSOR"; payload: Sponsor }
  | { type: "DELETE_SPONSOR"; payload: string }
  // Proposals
  | { type: "ADD_PROPOSAL"; payload: SponsorshipProposal }
  | { type: "UPDATE_PROPOSAL"; payload: SponsorshipProposal }
  | { type: "DELETE_PROPOSAL"; payload: string }

// ==========================================
// REDUCER
// ==========================================

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // People
    case "ADD_PERSON":
      return { ...state, people: [...state.people, action.payload] }
    case "UPDATE_PERSON":
      return { ...state, people: state.people.map(p => p.id === action.payload.id ? action.payload : p) }
    case "DELETE_PERSON":
      return { ...state, people: state.people.filter(p => p.id !== action.payload) }

    // Equipment
    case "ADD_EQUIPMENT":
      return { ...state, equipment: [...state.equipment, action.payload] }
    case "UPDATE_EQUIPMENT":
      return { ...state, equipment: state.equipment.map(e => e.id === action.payload.id ? action.payload : e) }
    case "DELETE_EQUIPMENT":
      return { ...state, equipment: state.equipment.filter(e => e.id !== action.payload) }

    // Financials
    case "ADD_FINANCIAL":
      return { ...state, financials: [...state.financials, action.payload] }
    case "UPDATE_FINANCIAL":
      return { ...state, financials: state.financials.map(f => f.id === action.payload.id ? action.payload : f) }
    case "DELETE_FINANCIAL":
      return { ...state, financials: state.financials.filter(f => f.id !== action.payload) }

    // Communication
    case "ADD_COMMUNICATION":
      return { ...state, communication: [...state.communication, action.payload] }
    case "UPDATE_COMMUNICATION":
      return { ...state, communication: state.communication.map(c => c.id === action.payload.id ? action.payload : c) }
    case "DELETE_COMMUNICATION":
      return { ...state, communication: state.communication.filter(c => c.id !== action.payload) }

    // Events
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] }
    case "UPDATE_EVENT":
      return { ...state, events: state.events.map(e => e.id === action.payload.id ? action.payload : e) }
    case "DELETE_EVENT":
      return { ...state, events: state.events.filter(e => e.id !== action.payload) }
    case "ASSIGN_RESOURCE": {
      const { eventId, resourceType, resourceId } = action.payload
      const fieldMap = {
        people: "assignedPeople",
        equipment: "assignedEquipment",
        financials: "assignedFinancials",
        communication: "assignedCommunication",
      } as const
      const field = fieldMap[resourceType]
      return {
        ...state,
        events: state.events.map(e => {
          if (e.id !== eventId) return e
          const current = e[field] as string[]
          if (current.includes(resourceId)) return e
          return { ...e, [field]: [...current, resourceId] }
        }),
      }
    }
    case "UNASSIGN_RESOURCE": {
      const { eventId, resourceType, resourceId } = action.payload
      const fieldMap = {
        people: "assignedPeople",
        equipment: "assignedEquipment",
        financials: "assignedFinancials",
        communication: "assignedCommunication",
      } as const
      const field = fieldMap[resourceType]
      return {
        ...state,
        events: state.events.map(e => {
          if (e.id !== eventId) return e
          return { ...e, [field]: (e[field] as string[]).filter(id => id !== resourceId) }
        }),
      }
    }

    // Sponsors
    case "ADD_SPONSOR":
      return { ...state, sponsors: [...state.sponsors, action.payload] }
    case "UPDATE_SPONSOR":
      return { ...state, sponsors: state.sponsors.map(s => s.id === action.payload.id ? action.payload : s) }
    case "DELETE_SPONSOR":
      return { ...state, sponsors: state.sponsors.filter(s => s.id !== action.payload) }

    // Proposals
    case "ADD_PROPOSAL":
      return { ...state, proposals: [...state.proposals, action.payload] }
    case "UPDATE_PROPOSAL":
      return { ...state, proposals: state.proposals.map(p => p.id === action.payload.id ? action.payload : p) }
    case "DELETE_PROPOSAL":
      return { ...state, proposals: state.proposals.filter(p => p.id !== action.payload) }

    default:
      return state
  }
}

// ==========================================
// CONTEXT
// ==========================================

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider")
  }
  return context
}
