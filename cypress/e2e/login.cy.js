describe('Prueba de inicio de sesión', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173/login') // Visitar la página de login
  })

  it('Se permite al usuario iniciar sesión introduciendo credenciales válidas', () => {
    cy.get('#user').type('usuario_prueba'); // Completar campo usuario
    cy.get('#password').type('contraseña'); // Completar campo contraseña
    cy.get('.login-button').click(); // Pulsar botón iniciar sesión

    cy.url().should('include', '/'); // Verificar que accede correctamente a la página home

    //cy.contains('').should('be.visible'); // Verificar que se muestra contenido después de iniciar sesión


  })

  it('Se muestra un mensaje de error si las credenciales no son válidas'), () => {
  cy.get('#user').type('usuarioIncorrecto');
  cy.get('#password').type('contraseñaIncorrecta');
  cy.get('.login-button').click(); 

  //cy.contains('').should('be.visible'); // Verificar que se muestra un mensaje de error
  }
})