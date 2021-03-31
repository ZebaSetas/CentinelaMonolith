const Queue = require('./queue-service')

module.exports = class MailerService {
  constructor() {
    this.emailQueue = new Queue('Email Bug Queue')
  }

  async sendNewBugEmail(bug, users) {

    users.forEach(user => {
      //const email = user
      const email = user.dataValues.email
      let emailObject = {
        address: email
        , subject: 'Nuevo Bug registrado'
        , bodyText: newBugBodyText(bug)
        , bodyHTML: newBugBodyHTML(bug)
      }
      this.emailQueue.add(emailObject, Queue.QUEUE_DEFAULT_OPTIONS)
    });
  }

  async sendInvitationEmail(invitation) {
    let emailObject = {
      address: invitation.invitedEmail
      , subject: 'Invitacion a Centinela'
      , bodyText: newInvitationBodyText(invitation)
      , bodyHTML: newInvitationBodyHTML(invitation)
    }
    this.emailQueue.add(emailObject, Queue.QUEUE_DEFAULT_OPTIONS)
  }
}

newBugBodyText = (bug) => {
  `Se a registrado un nuevo bug
   Titulo: ${bug.title}
   Descripcion: ${bug.description}
   Correo generado automáticamente por Centinela - Tu Bug Tracker favorito`
}
newBugBodyHTML = (bug) => {
  return `<!DOCTYPE html>
  <html>
  <head>
  <style>
      table{
        border-collapse: collapse;
        align="center;
        max-width: 150px;
        table-layout: fixed;
          }
      th, td {
            padding: 10px;
            border-collapse: collapse;
          }
      .values {
          min-width: 10px;
          width: 25px;
          max-width: 25px;
          text-align:left;
      }
      .info {
          min-width: 50px;
          width: 100px;
          max-width: 150px;
      }  
  </style>
  <title>Nuevo Bug</title>
  </head>
  <body>
  
  <h1>Nuevo Bug Registrado</h1>
  <table>
      <tr>
          <td class="values"><b>Titulo:</b></td>
          <td>${bug.title}</td>
      </tr>
      <tr>
          <td class="info"><b>Descripcion:</b></td>
          <td><p>${bug.description}</p></td>
      </tr>
  </table>
  <br>
  <h4><p>Correo generado automáticamente por <b>Centinela</b> - Tu Bug Tracker favorito</p></h4>
  </body>
  </html>`
}

newInvitationBodyText = (invitation) => {
  `Has sido invitado a participar de Centinela
   Organizacion: ${invitation.organizationName}
   Correo: ${invitation.invitedEmail}
   Link: ${invitation.uri}
   Correo generado automáticamente por Centinela - Tu Bug Tracker favorito`
}

newInvitationBodyHTML = (invitation) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <style>
          table{
            border-collapse: collapse;
            align="center;
            max-width: 150px;
            table-layout: fixed;
              }
          th, td {
                padding: 10px;
                border-collapse: collapse;
              }
          .values {
              min-width: 10px;
              width: 25px;
              max-width: 25px;
              text-align:left;
          }
          .info {
              min-width: 50px;
              width: 100px;
              max-width: 150px;
          }  
      </style>
      <title>Invitacion a Centinela</title>
    </head>
    <body>
      <h1>Has sido invitado a unirte a Centinela</h1>
      <h3>Nombre de la Organizacion: <b>${invitation.organizationName}<b></h3>
        <table>
          <tr>
              <td class="info"><b>Direccion:</b></td>
              <td><p>${invitation.invitedEmail}</p></td>
          </tr>
          <tr>
              <td class="info"><b>Link</b></td>
              <td><p><a href="${invitation.uri}">Unirme</a></p></td>
          </tr>
      </table>
      <br>
      <h4><p>Correo generado automáticamente por <b>Centinela</b> - Tu Bug Tracker favorito</p></h4>
    </body>
  </html>`
}
