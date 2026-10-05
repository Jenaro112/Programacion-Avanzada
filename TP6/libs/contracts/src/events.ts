// Event Envelope
export interface IntegrationEvent<T = any> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  correlationId: string;
  customerId: string;
  source: string;
  payload: T;
}

// ActivationRequested Payload
export interface ActivationRequestedPayload {
  planId: string;
  channel: string;
  simulateFailure: 'none' | 'billing' | 'provisioning';
}

// Service Result Payload (OK/FAILED)
export interface ServiceResultPayload {
  status: 'OK' | 'FAILED';
  reason?: string;
}

// Event Types for Activation
export type ActivationRequestedEvent = IntegrationEvent<ActivationRequestedPayload>;
export type ActivationCompletedEvent = IntegrationEvent<null>;
export type ActivationFailedEvent = IntegrationEvent<{ reason: string }>;

export type BillingAccountCreatedEvent = IntegrationEvent<ServiceResultPayload>;
export type BillingAccountCancelledEvent = IntegrationEvent<null>;

export type ProvisioningCompletedEvent = IntegrationEvent<ServiceResultPayload>;
export type ProvisioningFailedEvent = IntegrationEvent<{ reason: string }>;
