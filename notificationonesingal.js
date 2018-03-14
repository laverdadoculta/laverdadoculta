var OneSignal = window.OneSignal || [];
OneSignal.push(["init", {

    appId: "6674303f-4391-43ae-8bdc-d24f2668b5e5",
    autoRegister: true, 

    httpPermissionRequest: {
        enable: true
    },

    notifyButton: {
        enable: false 
    },

    welcomeNotification: {
        "title": "Mejores Promociones Movistar",
        "message": "Gracias por suscribirte!",
        // "url": "" 
    },

    promptOptions: {
      actionMessage: "Nos gustaría mostrarte nuestras mejores Promociones.",
      acceptButtonText: "LO QUIERO",
      cancelButtonText: "NO GRACIAS"
    }
}]);
