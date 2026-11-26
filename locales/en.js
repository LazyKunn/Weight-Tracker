// English texts.
// To add a new language: copy this file (e.g. to es.js), change "en" to the new code,
// translate the texts on the right, and add the file to index.html and sw.js.
// Texts written as functions, like (n) => ..., receive a value (a number, a name...).

window.LOCALES = window.LOCALES || {};

window.LOCALES.en = {
  _name: "English",   // shown in the language picker
  _locale: "en-GB",   // used to format dates and times (day/month/year, 24h clock)

  // Screen titles (top of the screen)
  viewDashboardEyebrow: "Today",
  viewDashboardTitle: "Your progress",
  viewHistoryEyebrow: "Full log",
  viewHistoryTitle: "Weight history",
  viewGoalsEyebrow: "Plan and habits",
  viewGoalsTitle: "Your goals",
  viewSettingsEyebrow: "Your app",
  viewSettingsTitle: "Settings",
  greeting: (name) => `Hi, ${name}`,
  welcome: "Welcome",

  // Bottom tabs
  tabDashboard: "Dashboard",
  tabHistory: "History",
  tabGoals: "Goals",
  tabSettings: "Settings",

  // Dashboard
  noEntriesYet: "No entries yet",
  weightPlaceholder: "Today's weight (kg)",
  logBtn: "Log",
  firstEntry: "First entry",
  progressTitle: "Progress",
  rangeAll: "All",
  range1m: "Last month",
  range3m: "3 months",
  recentTitle: "Recent entries",
  seeHistory: "See history",
  logFirstWeight: "Log your first weight above 👆",
  today: "Today",
  yesterday: "Yesterday",
  invalidWeight: "Enter a valid weight",
  weightLogged: "Weight logged ✓",

  // Chart
  chartWeight: "Weight",
  chartGoal: "Goal",
  chartLoadError: "Couldn't load the chart library right now (it needs internet the first time you open the app, or it may be down). Your entries are still saved, and the chart will appear as soon as the app can load the library.",

  // History
  allEntriesTitle: "All entries",
  noEntriesHistory: "No entries yet.",
  deleteEntry: "Delete",
  entryDeleted: "Entry deleted",

  // Goals
  targetWeightTitle: "Target weight",
  goalPlaceholder: "Set a new goal (kg)",
  currentGoalPlaceholder: (kg) => `Current goal: ${kg} kg`,
  save: "Save",
  setGoal: "Set a goal",
  goalReached: "Goal reached 🎉",
  kgToGo: (kg) => `${kg} kg to go`,
  invalidGoal: "Enter a valid goal",
  goalSaved: "Goal saved ✓",

  // Weekly reminder
  reminderTitle: "Weekly reminder",
  dayOfWeek: "Day of the week",
  day0: "Sun", day1: "Mon", day2: "Tue", day3: "Wed", day4: "Thu", day5: "Fri", day6: "Sat",
  time: "Time",
  enableNotifications: "Enable notifications",
  reminderNote: "Note: since this app doesn't use a server, the reminder only fires reliably if the app is open (or was recently in the background) on the chosen day and time. If the app has been fully closed for a long time, Android may not wake up the reminder.",
  notifUnsupported: "Your browser doesn't support notifications. You'll see an in-app message at the chosen time if the app is open.",
  notifEnabled: "Notifications enabled ✓",
  notifBlocked: "Notifications are blocked in your phone settings. You'll see an in-app message instead.",
  notifNotYet: "Notifications not enabled yet.",
  notifTitle: "Time to weigh in ⚖️",
  notifBody: "Weekly check-in: open the app and log today's weight.",
  reminderToast: "Reminder: today is weigh-in day ⚖️",

  // Settings
  languageTitle: "Language",
  yourName: "Your name",
  namePlaceholder: "What should we call you?",
  nameSaved: "Name saved ✓",
  importTitle: "Import data",
  importNote: "Restore entries from a previously exported .csv file (useful after clearing the site data or reinstalling the app). Duplicate entries are skipped automatically.",
  importBtn: "Import CSV",
  noValidEntries: "No valid entries found in that file",
  entriesImported: (n) => n === 1 ? "1 entry imported ✓" : `${n} entries imported ✓`,
  alreadySaved: "All those entries were already saved",
  readError: "Couldn't read that file",
  exportTitle: "Export data",
  exportNote: "Creates a .csv file with your full history, ready to send via WhatsApp, Discord, email, etc.",
  exportBtn: "Export / Share CSV",
  nothingToExport: "No entries to export yet",
  shareTitle: "Weight history",
  shareText: "My weight history",
  csvDownloaded: "CSV downloaded ✓",
  installTitle: "Install app",
  installNote: "Use the browser menu → \"Add to Home screen\" to install this app on your phone.",
  installNoteReady: "Install the app to always have it at hand, like any other app.",
  installBtn: "Install on phone",
  dataTitle: "Data",
  deleteAll: "Delete all data",
  confirmDeleteAll: "Delete ALL data (entries, goal, settings)? This can't be undone.",
  dataDeleted: "Data deleted",
  localVersion: "local version",
  version: "version",
  footerData: "all data stays on this device"
};
