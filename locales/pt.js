// Portuguese (Portugal) texts. Same keys as en.js.

window.LOCALES = window.LOCALES || {};

window.LOCALES.pt = {
  _name: "Português",
  _locale: "pt-PT",

  // Screen titles (top of the screen)
  viewDashboardEyebrow: "Hoje",
  viewDashboardTitle: "O teu progresso",
  viewHistoryEyebrow: "Registo completo",
  viewHistoryTitle: "Histórico de peso",
  viewGoalsEyebrow: "Plano e hábitos",
  viewGoalsTitle: "Os teus objetivos",
  viewSettingsEyebrow: "A tua app",
  viewSettingsTitle: "Definições",
  greeting: (name) => `Olá, ${name}`,
  welcome: "Bem-vindo",

  // Bottom tabs
  tabDashboard: "Início",
  tabHistory: "Histórico",
  tabGoals: "Objetivos",
  tabSettings: "Definições",

  // Dashboard
  noEntriesYet: "Ainda sem registos",
  weightPlaceholder: "Peso de hoje (kg)",
  logBtn: "Registar",
  firstEntry: "1º registo",
  progressTitle: "Evolução",
  rangeAll: "Tudo",
  range1m: "Último mês",
  range3m: "3 meses",
  recentTitle: "Registos recentes",
  seeHistory: "Ver histórico",
  logFirstWeight: "Regista o teu primeiro peso acima 👆",
  today: "Hoje",
  yesterday: "Ontem",
  invalidWeight: "Introduz um peso válido",
  weightLogged: "Peso registado ✓",

  // Chart
  chartWeight: "Peso",
  chartGoal: "Objetivo",
  chartLoadError: "Não consegui carregar a biblioteca do gráfico agora (precisa de internet na primeira vez que abres a app, ou pode estar em baixo). Os teus registos estão guardados na mesma — o gráfico aparece assim que a app conseguir carregar a biblioteca.",

  // History
  allEntriesTitle: "Todos os registos",
  noEntriesHistory: "Sem registos ainda.",
  deleteEntry: "Apagar",
  entryDeleted: "Registo apagado",

  // Goals
  targetWeightTitle: "Peso objetivo",
  goalPlaceholder: "Definir novo objetivo (kg)",
  currentGoalPlaceholder: (kg) => `Objetivo atual: ${kg} kg`,
  save: "Guardar",
  setGoal: "Define um objetivo",
  goalReached: "Objetivo atingido 🎉",
  kgToGo: (kg) => `Faltam ${kg} kg`,
  invalidGoal: "Introduz um objetivo válido",
  goalSaved: "Objetivo guardado ✓",

  // Weekly reminder
  reminderTitle: "Lembrete semanal",
  dayOfWeek: "Dia da semana",
  day0: "Dom", day1: "Seg", day2: "Ter", day3: "Qua", day4: "Qui", day5: "Sex", day6: "Sáb",
  time: "Hora",
  enableNotifications: "Ativar notificações",
  reminderNote: "Nota: como esta app não usa nenhum servidor, o lembrete só dispara com fiabilidade se a app estiver aberta (ou em segundo plano recente) no dia/hora escolhido. Se o telemóvel tiver a app completamente fechada há muito tempo, o Android pode não acordar o lembrete.",
  notifUnsupported: "O teu browser não suporta notificações — vais ver um aviso dentro da app à hora marcada, se a app estiver aberta.",
  notifEnabled: "Notificações ativas ✓",
  notifBlocked: "Notificações bloqueadas nas definições do telemóvel. Vais ver um aviso dentro da app em alternativa.",
  notifNotYet: "Notificações ainda não ativadas.",
  notifTitle: "Hora de te pesares ⚖️",
  notifBody: "Registo semanal — abre a app e regista o teu peso de hoje.",
  reminderToast: "Lembrete: hoje é dia de te pesares ⚖️",

  // Settings
  languageTitle: "Idioma",
  yourName: "O teu nome",
  namePlaceholder: "Como te devemos chamar?",
  nameSaved: "Nome guardado ✓",
  importTitle: "Importar dados",
  importNote: "Restaura registos a partir de um ficheiro .csv exportado anteriormente (útil depois de limpar os dados do site ou reinstalar a app). Registos duplicados são ignorados automaticamente.",
  importBtn: "Importar CSV",
  noValidEntries: "Não encontrei registos válidos nesse ficheiro",
  entriesImported: (n) => n === 1 ? "1 registo importado ✓" : `${n} registos importados ✓`,
  alreadySaved: "Esses registos já estavam todos guardados",
  readError: "Não consegui ler esse ficheiro",
  exportTitle: "Exportar dados",
  exportNote: "Gera um ficheiro .csv com todo o histórico, pronto a enviar por WhatsApp, Discord, email, etc.",
  exportBtn: "Exportar / Partilhar CSV",
  nothingToExport: "Ainda não há registos para exportar",
  shareTitle: "Histórico de peso",
  shareText: "O meu histórico de peso",
  csvDownloaded: "CSV descarregado ✓",
  installTitle: "Instalar app",
  installNote: "Usa o menu do browser → \"Adicionar ao ecrã principal\" para instalar esta app no telemóvel.",
  installNoteReady: "Instala a app para a teres sempre à mão, como qualquer outra app.",
  installBtn: "Instalar no telemóvel",
  dataTitle: "Dados",
  deleteAll: "Apagar todos os dados",
  confirmDeleteAll: "Apagar TODOS os dados (registos, objetivo, definições)? Esta ação não pode ser desfeita.",
  dataDeleted: "Dados apagados",
  localVersion: "versão local",
  version: "versão",
  footerData: "tudo guardado só neste dispositivo"
};
