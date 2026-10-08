// PipelineViewDocPage.qml — Living Documentation for ChaSetPipelineView
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
  id: root
  category: "Composite Engines"
  pageTitle: "Pipeline View"
  description: ChaSetI18n.tr("components.pipelineView.description", "Multi-stage execution view and pipeline center with job tracking, step timelines, and virtualized auto-scrolling log console.")

  property var sampleSteps: [
    { name: ChaSetI18n.tr("desktopComposite.pipelineView.stepParseSpirv", "Parse SPIR-V Bytecode"), status: "success", durationMs: 3200 },
    { name: ChaSetI18n.tr("desktopComposite.pipelineView.stepDeadCode", "Dead Code Elimination"), status: "success", durationMs: 4100 },
    { name: ChaSetI18n.tr("desktopComposite.pipelineView.stepRegAlloc", "Hardware Register Allocation"), status: "running", durationMs: null },
    { name: ChaSetI18n.tr("desktopComposite.pipelineView.stepEmitBinary", "Emit Target Binary"), status: "queued", durationMs: null }
  ]

  property var sampleJobs: [
    {
      id: "job-1",
      name: ChaSetI18n.tr("desktopComposite.pipelineView.jobShaderComp", "Shader Compilation"),
      status: "success",
      durationMs: 12400,
      steps: [
        { name: ChaSetI18n.tr("desktopComposite.pipelineView.stepCompileVertex", "Compile Vertex Stage"), status: "success", durationMs: 5000 },
        { name: ChaSetI18n.tr("desktopComposite.pipelineView.stepCompileFragment", "Compile Fragment Stage"), status: "success", durationMs: 7400 }
      ]
    },
    {
      id: "job-2",
      name: ChaSetI18n.tr("desktopComposite.pipelineView.jobBenchmark", "Benchmark Suite"),
      status: "running",
      durationMs: null,
      steps: root.sampleSteps
    },
    {
      id: "job-3",
      name: ChaSetI18n.tr("desktopComposite.pipelineView.jobPackage", "Package Artifacts"),
      status: "queued",
      durationMs: null,
      steps: []
    }
  ]

  property var sampleLogs: ({
    "job-1": [
      "[compiler] Initializing Vulkan GLSL compiler...",
      "[compiler] \u001B[32mStage 1/2: Vertex shader compiled successfully\u001B[0m",
      "[compiler] \u001B[32mStage 2/2: Fragment shader compiled successfully\u001B[0m",
      "[compiler] Pipeline layout validated (0 errors, 0 warnings)"
    ],
    "job-2": [
      "[bench] Initializing benchmark context...",
      "[bench] GPU: NVIDIA GeForce RTX 4090",
      "[bench] Warmup pass completed (144.2 fps)",
      "[bench] \u001B[33mRunning ray tracing reflection stress test...\u001B[0m",
      "[bench] Iteration 1: 142.8 fps (frame delta: 0.12ms)",
      "[bench] Iteration 2: 144.1 fps (frame delta: 0.08ms)",
      "[bench] \u001B[32mActive thermal profile: Nominal (58°C)\u001B[0m"
    ],
    "job-3": [
      "[package] Waiting for benchmark job to conclude..."
    ]
  })

  function getLogsForJob(jobId) {
    if (root.sampleLogs && root.sampleLogs[jobId]) {
      return root.sampleLogs[jobId]
    }
    return []
  }

  property string activeJobId: "job-2"

  ComponentPreview {
    title: ChaSetI18n.tr("desktopComposite.pipelineView.sandboxTitle", "Pipeline View Sandbox")
    stageHeight: 472
    reactCode: `<PipelineView\n  status="running"\n  startMs={0}\n  endMs={null}\n  jobs={jobs}\n  activeJobId={activeJobId}\n  onSelectJob={setActiveJobId}\n  getLogs={jobId => logs[jobId] ?? []}\n/>`
    qtCode: `ChaSetPipelineView {\n    width: parent.width\n    status: "running"\n    jobs: root.sampleJobs\n    activeJobId: "job-2"\n    logsSupplier: function(jobId) { return root.getLogsForJob(jobId) }\n}`

    Item {
      anchors.fill: parent
      anchors.margins: 12

      ChaSetPipelineView {
        anchors.fill: parent
        status: "running"
        jobs: root.sampleJobs
        activeJobId: root.activeJobId
        onJobSelected: function(jobId) { root.activeJobId = jobId }
        logsSupplier: function(jobId) { return root.getLogsForJob(jobId) }
      }
    }
  }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet

ChaSetPipelineView {
    width: parent.width
    stages: stagesModel
}`
        reactCode: `import { PipelineView } from '@chahu/cha-set';

<PipelineView stages={stages} activeStageIndex={0} />`
    }

    // Animations
    Column {
        property string sectionId: "animations"
        width: parent.width
        spacing: 12

        Text { text: ChaSetI18n.tr("showcase.animations", "Animations"); color: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }
        Text { text: ChaSetI18n.tr("desktopComposite.pipelineView.animationsDesc", "Execution transitions and status node states are governed by shared motion tokens:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeBody; wrapMode: Text.WordWrap; width: parent.width }
        Text { text: ChaSetI18n.tr("desktopComposite.pipelineView.animationsBulletQt1", "• Active execution nodes (running, compiling, retrying) display continuous rotation animations."); color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; wrapMode: Text.WordWrap; width: parent.width }
        Text { text: ChaSetI18n.tr("desktopComposite.pipelineView.animationsBulletQt2", "• Job list selection and hover states interpolate smoothly using ThemeTokens.motionQuick."); color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; wrapMode: Text.WordWrap; width: parent.width }
        Text { text: ChaSetI18n.tr("desktopComposite.pipelineView.animationsBulletQt3", "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero."); color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; wrapMode: Text.WordWrap; width: parent.width }
    }

    ComponentReference {
        name: "PipelineView"
        componentId: "pipeline-view"
        propsModel: [
            { name: "status", type: "string", default: "'running'", description: ChaSetI18n.tr("components.pipelineView.statusDesc", "Overall execution status for summary header badge.") },
            { name: "startMs", type: "real", default: "0", description: ChaSetI18n.tr("components.pipelineView.startMsDesc", "Execution start timestamp in epoch milliseconds.") },
            { name: "endMs", type: "var", default: "null", description: ChaSetI18n.tr("components.pipelineView.endMsDesc", "Execution completion timestamp; displays formatted duration when non-null.") },
            { name: "jobs", type: "var", default: "[]", description: ChaSetI18n.tr("components.pipelineView.jobsDesc", "Array of jobs belonging to the current execution run.") },
            { name: "activeJobId", type: "string", default: "''", description: ChaSetI18n.tr("components.pipelineView.activeJobIdDesc", "Currently selected job id displaying step timeline and logs.") },
            { name: "logsSupplier", type: "var", default: "null", description: ChaSetI18n.tr("components.pipelineView.getLogsDesc", "Function supplying log lines array for a given job id.") },
            { name: "jobsTitle", type: "string", default: "'Jobs'", description: ChaSetI18n.tr("components.pipelineView.jobsTitleDesc", "Title text for the job list sidebar.") },
            { name: "emptyJobsText", type: "string", default: "'No jobs'", description: ChaSetI18n.tr("components.pipelineView.emptyJobsTextDesc", "Placeholder text displayed when the job list is empty.") },
            { name: "cancelDisabled", type: "bool", default: "false", description: ChaSetI18n.tr("components.pipelineView.cancelDisabledDesc", "Disables the cancel button.") }
        ]
    }
}
