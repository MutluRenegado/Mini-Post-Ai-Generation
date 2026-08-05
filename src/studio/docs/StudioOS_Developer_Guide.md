# StudioOS Version 2.0 — Complete Developer & Architecture Guide

## Overview

StudioOS is a complete, enterprise-grade AI Creator Studio Operating System.

## Architecture Map

```
Studio Workspace (Visual Workflow Builder & Studio Debug Console)
        │
        ▼
WorkflowEngine ─────────► WorkflowRunner & WorkflowHistory
        │
        ▼
AgentManager (9 Core Autonomous Agents)
  ├── TopicAgent
  ├── ResearchAgent
  ├── KnowledgeAgent
  ├── WriterAgent
  ├── ImageAgent
  ├── SEOAgent
  ├── QualityAgent
  ├── BrandAgent
  └── ExportAgent
        │
        ▼
AI Pipeline & Provider Router (Gemini / OpenAI / Claude)
        │
        ▼
Knowledge Studio & Learning Engine (Continuous improvement)
        │
        ▼
Prompt Studio (Versioned prompt templates)
        │
        ▼
ApprovalEngine & ReviewWorkflow
        │
        ▼
Publisher & Multi-Platform Dispatcher
```

## Developer & Inspector Views

- **Pipeline Inspector**: `src/studio/inspector/PipelineInspector.tsx`
- **Debug Console**: `src/studio/debug/StudioDebugConsole.tsx`
- **Visual Workflow Builder**: `src/studio/workflow/VisualWorkflowBuilder.tsx`
- **Agent Telemetry Dashboard**: `src/studio/agents/AgentTelemetryDashboard.tsx`
- **Prompt Studio**: `src/studio/prompts/PromptStudioView.tsx`
- **Knowledge Studio**: `src/studio/knowledge/KnowledgeStudioView.tsx`
- **AI Evaluation Lab**: `src/studio/evaluation/AIEvaluationLab.tsx`
- **Publishing Center**: `src/studio/publishing/PublishingCenterView.tsx`
- **Learning Engine**: `src/lib/ai/learning/LearningEngine.ts`
- **Test Runner**: `src/studio/__tests__/StudioOS.test.ts`
