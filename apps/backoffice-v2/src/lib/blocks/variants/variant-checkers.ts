import { TWorkflowById } from '@/domains/workflows/fetchers';
import { WorkflowDefinitionVariant } from '@ballerine/common';

export const checkIsKybExampleVariant = (
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>,
) =>
  workflowDefinition?.version >= 0 &&
  workflowDefinition?.variant === WorkflowDefinitionVariant.KYB &&
  workflowDefinition?.config?.isExample;

export const checkIsManualReviewVariant = (
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>,
) =>
  workflowDefinition?.version >= 0 &&
  workflowDefinition?.variant === WorkflowDefinitionVariant.MANUAL_REVIEW &&
  workflowDefinition?.config?.isLegacyReject;

export const checkIsWebsiteMonitoringVariant = (
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant'>,
) => workflowDefinition?.variant === WorkflowDefinitionVariant.WEBSITE_MONITORING;

export const checkIsOngoingVariant = (
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>,
) =>
  workflowDefinition?.version >= 0 &&
  workflowDefinition?.variant === WorkflowDefinitionVariant.ONGOING;

export const checkIsAmlVariant = (
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>,
) =>
  workflowDefinition?.version >= 0 && workflowDefinition?.variant === WorkflowDefinitionVariant.AML;
