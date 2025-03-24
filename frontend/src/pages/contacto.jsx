import React, { useState } from 'react';

const Contacto = () => {
  // Estado para gestionar los valores del formulario
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario (API, backend, etc.)
    console.log('Formulario enviado:', form);
  };

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1>Contáctanos</h1>
        <p>Si tienes alguna pregunta, no dudes en llenar el formulario y nos pondremos en contacto contigo.</p>
      </header>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Mensaje</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Enviar</button>
          </form>
        </div>
      </div>

      
    </div>
  );
};

export default Contacto;
