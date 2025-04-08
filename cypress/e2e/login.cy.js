// Prueba E2E para iniciar sesión
describe('Prueba de inicio de sesión', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173/login') // Visitar la página de login
  })

  it('Se permite al usuario iniciar sesión introduciendo credenciales válidas', () => {
    cy.get('#user').type('usuario@prueba.com'); // Completar campo usuario
    cy.get('#password').type('contraseña'); // Completar campo contraseña
    cy.get('.login-button').click(); // Pulsar botón iniciar sesión

    cy.url().should('include', 'http://localhost:5173/home'); // Verificar que accede correctamente a la página home

  })

  it('Se muestra un mensaje de error si no se completan todos los campos', () => {
    cy.visit('http://localhost:5173/login') // Visitar la página de login
    cy.get('.login-button').click();

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Debe rellenar todos los campos para iniciar sesión.'); // Verificar que se muestra un mensaje de error
    })
  })

  it('Se muestra un mensaje de error si el usuario introducido no es válido', () => {
    cy.visit('http://localhost:5173/login') // Visitar la página de login

    cy.get('#user').type('usuarioIncorrecto');
    cy.get('#password').type('contraseña');
    cy.get('.login-button').click();

    cy.on('window:alert', (text) => {
      expect(text).to.equal('El usuario debe ser un correo electrónico.'); // Verificar que se muestra un mensaje de error
    })
  })

  it('Se muestra un mensaje de error si la contraseña introducida no es válida', () => {
    cy.visit('http://localhost:5173/login') // Visitar la página de login

    cy.get('#user').type('usuario@prueba.com');
    cy.get('#password').type('passw');
    cy.get('.login-button').click();

    cy.on('window:alert', (text) => {
      expect(text).to.equal('La contraseña debe tener al menos 6 caracteres.'); // Verificar que se muestra un mensaje de error
    })
  })

  it('Se muestra un mensaje informativo al solicitar un cambio de contraseña', () => {
    cy.visit('http://localhost:5173/login') // Visitar la página de login
    cy.get('.passw-button').click();

    cy.on('window:alert', (text) => {

      expect(text).to.equal('El centro de estudios se pondrá en contacto contigo próximamente para proporcionarte una nueva contraseña.');
    })
  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // Previene que Cypress falle el test con excepciones no controladas
    return false;
  })


})