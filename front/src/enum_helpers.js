export const AREA_ENUM = [
    { key: 0, name: "Default", translation: "Padrão" },
    { key: 1, name: "COMPUTATION", translation: "COMPUTAÇÃO" },
    { key: 2, name: "EXACT_SCIENCES", translation: "EXATAS" },
    { key: 3, name: "HUMANITIES", translation: "HUMANAS" },
    { key: 4, name: "HEALTH", translation: "BIOLÓGICA" },
    { key: 5, name: "ENGINEERING", translation: "ENGENHARIA" },
  ];
  
  export const STATUS_ENUM = [
    { key: 0, name: "Default", translation: "Padrão" },
    { key: 1, name: "Active", translation: "Ativo" },
    { key: 2, name: "Graduated", translation: "Formado" },
    { key: 3, name: "Disconnected", translation: "Desconectado" },
  ];
  
  export const ROLES_ENUM = [
    { key: 0, name: "Default", translation: "Padrão" },
    { key: 1, name: "Student", translation: "Estudante" },
    { key: 2, name: "Professor", translation: "Professor" },
    { key: 3, name: "Administrator", translation: "Administrador" },
    { key: 4, name: "ExternalResearcher", translation: "Pesquisador Externo" },
    { key: 5, name: "ResetPassword", translation: "Redefinir Senha" },
  ];
  
  export const PROJECT_STATUS_ENUM = [
    { key: 0, name: "Default", translation: "Padrão" },
    { key: 1, name: "Active", translation: "Ativo" },
    { key: 2, name: "Inactive", translation: "Inativo" },
    { key: 3, name: "Closed", translation: "Encerrado" },
  ];
  
  export const INSTITUTION_TYPE_ENUM = [
    { key: 0, name: "Default", translation: "Padrão" },
    { key: 1, name: "Publica", translation: "PÚBLICA" },
    { key: 2, name: "Particular", translation: "PARTICULAR" },
    { key: 3, name: "CEFET", translation: "CEFET/RJ" },
  ];
  
  export const SCHOLARSHIP_TYPE = [
    { key: 0, name: "Default", translation: "SEM BOLSA" },
    { key: 1, name: "Cefet", translation: "CEFET/RJ" },
    { key: 2, name: "Capes", translation: "CAPES" },
    { key: 3, name: "FapeRj", translation: "FAPERJ" },
  ];

  export const translateEnumValue = (enumValues, value) => {
    const matchedValue = enumValues.find((item) => item.key === value || item.name === value);
    return matchedValue ? matchedValue.translation : "";
  };
  