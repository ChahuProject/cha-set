// PipelineViewDocPage.qml — Living Documentation for ChaSetPipelineView
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
  id: root
  category: "Composite Engines"
  pageTitle: "Pipeline View"
  description: "Multi-stage execution view and pipeline center with job tracking, step timelines, and virtualized auto-scrolling log console."
  tocItems: [
    { id: "overview", title: "Interactive Overview" },
    { id: "installation", title: "Installation" },
    { id: "animations", title: "Animations" },
    { id: "keyboard", title: "Keyboard Navigation" },
    { id: "props", title: "Props Reference" }
  ]

  property var sampleSteps: [
    { name: "Parse SPIR-V Bytecode", status: "success", durationMs: 3200 },
    { name: "Dead Code Elimination", status: "success", durationMs: 4100 },
    { name: "Hardware Register Allocation", status: "running", durationMs: null },
    { name: "Emit Target Binary", status: "queued", durationMs: null }
  ]

  property var sampleJobs: [
    {
      id: "job-1",
      name: "Shader Compilation",
      status: "success",
      durationMs: 12400,
      steps: [
        { name: "Compile Vertex Stage", status: "success", durationMs: 5000 },
        { name: "Compile Fragment Stage", status: "success", durationMs: 7400 }
      ]
    },
    {
      id: "job-2",
      name: "Benchmark Suite",
      status: "running",
      durationMs: null,
      steps: root.sampleSteps
    },
    {
      id: "job-3",
      name: "Package Artifacts",
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
    title: "Pipeline View Sandbox"
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

  // Installation
  Column {
    width: parent.width
    spacing: 8

    Text {
      text: "Installation"
      color: ThemeTokens.text
      font.pixelSize: 18
      font.weight: Font.DemiBold
    }
    ChaSetCodeBlock {
      width: parent.width
      language: "bash"
      code: "import ChaSet\n\nChaSetPipelineView {\n    status: \"running\"\n    jobs: myJobs\n}"
    }
  }

  // Animations
  Column {
    width: parent.width
    spacing: 12

    Text { text: "Animations"; color: ThemeTokens.text; font.pixelSize: 18; font.weight: Font.Bold }
    Text { text: "Execution transitions and status node states are governed by shared motion tokens:"; color: ThemeTokens.subduedText; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }
    Text { text: "• Active execution nodes (running, compiling, retrying) display continuous rotation animations."; color: ThemeTokens.text; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }
    Text { text: "• Job list selection and hover states interpolate smoothly using ThemeTokens.motionQuick."; color: ThemeTokens.text; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }
    Text { text: "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero."; color: ThemeTokens.text; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }
  }

  KeyboardShortcutsTable {
    componentId: "pipeline-view"
  }

  PropsTable {
    title: "Props Reference"
    props: [
      { name: "status", type: "string", default: "'running'", description: "Overall execution status for summary header badge." },
      { name: "startMs", type: "real", default: "0", description: "Execution start timestamp in epoch milliseconds." },
      { name: "endMs", type: "var", default: "null", description: "Execution completion timestamp; displays formatted duration when non-null." },
      { name: "jobs", type: "var", default: "[]", description: "Array of jobs belonging to the current execution run." },
      { name: "activeJobId", type: "string", default: "''", description: "Currently selected job id displaying step timeline and logs." },
      { name: "logsSupplier", type: "var", default: "null", description: "Function supplying log lines array for a given job id." },
      { name: "jobsTitle", type: "string", default: "'Jobs'", description: "Title text for the job list sidebar." },
      { name: "emptyJobsText", type: "string", default: "'No jobs'", description: "Placeholder text displayed when the job list is empty." },
      { name: "cancelDisabled", type: "bool", default: "false", description: "Disables the cancel button." }
    ]
  }
}
