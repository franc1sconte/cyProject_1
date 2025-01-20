/// <reference types="cypress"/>


// Espera al elemento

Cypress.Commands.add('doWait', (locator) => {//este commando implica esperar a que cargue ciertos elementos
    cy.get(locator).should('be.visible')
})

Cypress.Commands.add('doWaitBlank', (locator) => {//este commando implica esperar a que un input quede vacio
    cy.get(locator).should('have.value', '')
})

Cypress.Commands.add('doWaitAny', (locator) => {//este commando implica esperar a que un input tenga algo
    //cy.get(locator).should('not.be.undefined').and('not.have.value', '')
    cy.get(locator).should(($element) => {
        expect($element.val()).not.to.equal('');
    })
})

// Clickea el elemento

Cypress.Commands.add('doClick', (locator) => {
    cy.get(locator).trigger('mouseover').should('be.visible').click()
})

Cypress.Commands.add('doClickSimple', (locator) => {
    cy.get(locator).should('be.visible').click()
})

Cypress.Commands.add('doClickAs', (locator) => {
    cy.get(locator).as('click').trigger('mouseover')
    cy.get('@click').should('be.visible')
    cy.get('@click').click()
})

Cypress.Commands.add('doForceClick', (locator) => {
    //cy.get(locator).should('be.visible').trigger('mouseover')
    cy.get(locator).click({ force: true })
})

Cypress.Commands.add('doSelect', (locator, value) => {
    cy.get(locator).should('be.visible').select(value)
})

// Escribe en el elemento


Cypress.Commands.add('doType', (locator, text) => {
    cy.get(locator).trigger('mouseover').should('be.visible').clear().type(text)
})
Cypress.Commands.add('doForceType', (locator, text) => {
    cy.get(locator).trigger('mouseover').should('be.visible').type(text, { force: true }) // el force va a funcionar cuando sea un input 
})
Cypress.Commands.add('doFocusType', (locator, text) => {
    cy.get(locator).trigger('mouseover').should('be.visible').focus().type(text)// el force va a funcionar cuando sea un input 
})

Cypress.Commands.add('doTypeAs', (locator, text) => {
    cy.get(locator).as('type').trigger('mouseover')
    cy.get('@type').should('be.visible')
    cy.get('@type').clear()
    cy.get('@type').type(text)
})

Cypress.Commands.add('doTypeSimple', (locator, text) => {
    cy.get(locator).should('be.visible')
    cy.get(locator).type(text)
})


// Valida texto

Cypress.Commands.add('textValidator', (locator, text) => {
    cy.get(locator).should('be.visible').invoke('text').then((etiq) => {
        expect(etiq.trim()).to.deep.equal(text.trim())
    })
})


Cypress.Commands.add('valValidator', (locator, text) => {
    cy.get(locator).should('be.visible').invoke('val').then((etiq) => {
        expect(etiq.trim()).to.deep.equal(text)
    })
})

Cypress.Commands.add('textValidatorAs', (locator, text) => {
    cy.get(locator).as('text').trigger('mouseover')
    cy.get('@text').should('be.visible').invoke('text').then((etiq) => {
        expect(etiq.trim()).to.deep.equal(text)
    })
})

// Basicos

Cypress.Commands.add('urlValidator', (url) => {
    cy.url().should('be.eq', url)
})

Cypress.Commands.add('beVisible', (locator) => {
    cy.get(locator).should('be.visible').and('exist')
})

Cypress.Commands.add('notVisible', (locator) => {
    cy.get(locator).should('not.be.visible')//.and('exist')
})

Cypress.Commands.add('notExist', (locator) => {
    cy.get(locator).should('not.exist')//.and('exist')
})

Cypress.Commands.add('grillValidatorUpto1', (locatorgrill, column, text) => {
    cy.get(locatorgrill).should('be.visible').find('tr').its('length').should('be.lte', 1)
    cy.get(locatorgrill + ' td:nth-child(' + column + ')').should('have.text', text)
})

//--Este comando sirve para escribir un codigo item, consultarlo y compararlo con el resultado que entrega la grilla--
Cypress.Commands.add('grillaValidator2', (locator, button, locatorgrill, text) => {
    cy.get(locator).type(text)
    cy.get(button).click()
    cy.get(locatorgrill)
        .should('have.length', 1)
        .and('contain.text', text)
})
//--Este comando compara el input intruducido con el resultado entregado por la grilla--
Cypress.Commands.add('grillComparator', (locatorgrill, text) => {
    cy.get(locatorgrill)
        .should('have.length', 1)
        .and('contain.text', text)
})

Cypress.Commands.add('toastAssert', (text) => {
    cy.get('.ui-growl-item').should('be.visible').and('exist').and('have.text', text)
})
//el toastAssertItems funciona para para los toast de productos
Cypress.Commands.add('toastAssertItem', (text) => {
    cy.get('.ui-growl-message > p').should('be.visible').and('exist').and('have.text', text)
})

Cypress.Commands.add('toastAssertNew', (text) => {
    cy.get('.p-toast-detail').should('be.visible').and('exist').and('have.text', text)
})

Cypress.Commands.add('login', (user, pass) => {
    let datos
    cy.fixture(Cypress.env('datosJson'), { retryOnStatusCodeFailure: true }).then(function (datosv) {
        datos = datosv;
        cy.intercept('POST', 'https://api-iam.intercom.io/messenger/web/ping').as('login')
        cy.visit(Cypress.env('url'), { retryOnStatusCodeFailure: true })
        cy.urlValidator(Cypress.env('url'))
        cy.textValidator(loginPage.introTextAssert(), 'Seguimos innovando para mejorar tus días! #SomosGestion') //Esto no deberia hacerse pero para fines demostrativos nos sirve
        cy.doType(loginPage.usuarioInput(), user)
        cy.doType(loginPage.passInput(), pass)
        cy.doClick(loginPage.conectarBtn())
        //cy.wait(3000)//sin esta accion no entra a los bloques del if
        cy.wait('@login', { timeout: 20000 })
        cy.url().then(url => {
            if (url.includes(Cypress.env('url') + "pages/estadisticas/dashboard.faces")) {
                cy.urlValidator(Cypress.env('url') + "pages/estadisticas/dashboard.faces")
            } else if (url.includes(Cypress.env('url') + "pages/inicioSucursalEmpresa.faces")) {
                cy.wait(1000)
                cy.urlValidator(Cypress.env('url') + "pages/inicioSucursalEmpresa.faces")
                cy.doWait(inicioSucursalEmpresa.aceptarSucursalBtn())
                cy.doClick(inicioSucursalEmpresa.aceptarSucursalBtn())
            }
        })

    })
})

Cypress.Commands.add('grillType', (locatorgrill, column, text) => {
    //cy.wait(1000)
    cy.get(locatorgrill).should('be.visible')
    cy.get(locatorgrill).find('tr').its('length').should('be.lte', 1)
    cy.wait(1000)
    cy.get(locatorgrill + ' td:nth-child(' + column + ') span').clear().type(text)
})
Cypress.Commands.add('grillTypeAs', (locatorgrill, column, text) => {
    //cy.wait(1000)
    cy.get(locatorgrill).should('be.visible')
    cy.get(locatorgrill).find('tr').its('length').should('be.lte', 1)
    cy.wait(1000)
    cy.get(locatorgrill + ' td:nth-child(' + column + ') input:visible').as('locator')
    cy.get('@locator').clear().type(text)
})

Cypress.Commands.add('dropdownSelect', (title, opcion) => {
    cy.get(title).as('title').scrollIntoView()
    cy.get(opcion).as('opcion')
    //cy.wait('@title')
    cy.get('@title').should('be.visible').click()
    cy.wait(1000)
    cy.doWait('@opcion')
    cy.get('@opcion').click({ force: true })
})
Cypress.Commands.add('dropdownSelect2', (title, opcion) => {
    cy.get(title).should('be.visible').click()
    cy.wait(1000)
    cy.get(opcion).click({ force: true })
})
Cypress.Commands.add('setearCombo', (titulo, op) => {
    cy.get('.SpanLabelCmb:contains(' + titulo + ') [role="combobox"] label').invoke('text').then((texto) => {
        cy.log(texto)
        if (texto.trim() === op) {
            cy.log('SON IGUALES')
        } else if (texto !== op) {
            cy.log('SON DIFERENTES LOS TEXTOS')
            //cy.doClickAs('.SpanLabelCmb:contains(' + titulo + ') [role="combobox"]')
            cy.get('.SpanLabelCmb:contains(' + titulo + ') [role="combobox"]').click()
            cy.doWait('.ui-selectonemenu-items-wrapper ul [data-label="' + op + '"]:visible')
            //cy.doClickAs('.ui-selectonemenu-items-wrapper ul [data-label="' + op + '"]:visible')
            cy.get('.ui-selectonemenu-items-wrapper ul [data-label="' + op + '"]:visible').click()
            cy.doWait('.SpanLabelCmb:contains(' + op + ') [role="combobox"] label')// ojo si realmente funciona > by jony
        }
    })
})
Cypress.Commands.add('dropdownCheck', (title, opcion) => {
    cy.get(title).should('be.visible').scrollIntoView().click()
    cy.wait(1000)
    if (cy.get(opcion).should('not.be.checked')) {
        cy.get(opcion).should('be.visible').click()
    }
    //cy.get(opcion).should('be.visible').click()
})

Cypress.Commands.add('dropdownCheck2', (title, opcion) => {
    cy.get(title).should('be.visible').as('titulo')
    //cy.wait(1000)
    cy.get('@titulo').click()
    //cy.get(title).click()
    //cy.wait(1000)
    cy.get('[role="group"] li:contains(DEPOSITO) .ui-chkbox input').invoke('attr', 'aria-checked').then((state) => {
        if (state === 'true') {
            cy.log(state)
            cy.log('ESTA SELECCIONADO')
        } else {
            cy.log(state)
            cy.log('NO ESTA SELECCIONADO')
            cy.doForceClick(opcion)
        }
    })
})

Cypress.Commands.add('grillClick', (fila, column) => {
    cy.wait(1000)
    cy.get('[role=grid] tbody tr:nth-child(' + fila + ') td:nth-child(' + column + ')').should('be.visible').click()
})

Cypress.Commands.add('mantenerClasico', (urlclasica, urlbeta) => {
    cy.url().then(url => {
        if (url.includes(urlclasica)) {
            cy.urlValidator(urlclasica)
        } else if (url.includes(urlbeta)) {
            cy.urlValidator(urlbeta)
            cy.get('.card > :nth-child(1) button:contains(Beta)').click()
        }
    })
})

Cypress.Commands.add('mantenerBeta', (urlclasica, urlbeta) => {
    cy.url().then(url => {
        if (url.includes(urlbeta)) {
            cy.urlValidator(urlbeta)
        } else if (url.includes(urlclasica)) {
            cy.urlValidator(urlclasica)
            cy.get('.card > :nth-child(1) button:contains(Beta)').click()
        }
    })
})

Cypress.Commands.add('mouseOver', (locator) => {
    cy.get(locator).trigger('mouseover')
})

Cypress.Commands.add('toDateSimpl', () => {//este commando implica esperar a que cargue ciertos elementos
    const fechaActual = new Date(); // Obtiene la fecha y hora actuales
    const dia = fechaActual.getDate().toString().padStart(2, '0'); // Obtiene el día del mes (del 1 al 31)
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Obtiene el mes (del 0 al 11, por eso se suma 1)
    const anio = fechaActual.getFullYear().toString().slice(-2);
    const fechaFormateada = `${dia}/${mes}/${anio}`
    return cy.wrap(fechaFormateada)
})

Cypress.Commands.add('toDate', () => {//este commando implica esperar a que cargue ciertos elementos
    const fechaActual = new Date(); // Obtiene la fecha y hora actuales
    const dia = fechaActual.getDate().toString().padStart(2, '0'); // Obtiene el día del mes (del 1 al 31)
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Obtiene el mes (del 0 al 11, por eso se suma 1)
    const anio = fechaActual.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`
    return cy.wrap(fechaFormateada)
})

Cypress.Commands.add('toDateInvert', () => {//este commando implica esperar a que cargue ciertos elementos
    const fechaActual = new Date(); // Obtiene la fecha y hora actuales
    const dia = fechaActual.getDate().toString().padStart(2, '0'); // Obtiene el día del mes (del 1 al 31)
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Obtiene el mes (del 0 al 11, por eso se suma 1)
    const anio = fechaActual.getFullYear();
    const fechaFormateada = `${anio}/${mes}/${dia}`
    return cy.wrap(fechaFormateada)
})

Cypress.Commands.add('toDateAndHours', () => {
    const fechaActual = new Date()
    const diferenciaHoraria = (fechaActual.getTimezoneOffset() / 60) + 3 * 60 // 3 horas en minutos
    cy.log('DIFERENCIA HORARIA ', diferenciaHoraria)

    // Ajusta la fecha solo si la diferencia horaria es igual a 3 horas
    if (diferenciaHoraria === 3 * 60) {
        cy.log('RESTA LAS 3 HORAS')
        fechaActual.setTime(fechaActual.getTime() - diferenciaHoraria * 60 * 1000)
    }
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const anio = fechaActual.getFullYear()
    const hora = fechaActual.getHours().toString().padStart(2, '0')
    const minutos = fechaActual.getMinutes().toString().padStart(2, '0')

    const fechaHoraFormateada = `${dia}/${mes}/${anio} ${hora}:${minutos}`;
    return cy.wrap(fechaHoraFormateada);
})

Cypress.Commands.add('dateRangeValidator', (fecha1, fecha2, rangoMinutos) => {//este commando implica esperar a que cargue ciertos elementos
    function parseFecha(fecha) {
        const partesFecha = fecha.split(/[\/ :]/);
        return new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0], partesFecha[3], partesFecha[4]);
    }
    const date1 = parseFecha(fecha1);
    const date2 = parseFecha(fecha2);

    // Calcula la diferencia en milisegundos entre las dos fechas
    const diferenciaMilisegundos = Math.abs(date1 - date2);

    // Convierte la diferencia a minutos
    const diferenciaMinutos = diferenciaMilisegundos / (1000 * 60);

    // Verifica si la diferencia está dentro del rango especificado
    const fechaFormateada = diferenciaMinutos <= rangoMinutos;
    cy.log('Estado de la Comparacion de fechas: ')
    expect(fechaFormateada).to.be.true
})

Cypress.Commands.add('doWaitStateChange', (locator, tipo, valorcambio) => {
    let valor
    if (tipo === 'text') {
        cy.waitUntil(() => {
            return cy.get(locator).invoke('text').then((texto) => {
                valor = texto
                cy.log('Texto que se obtuvo', valor)
                if (valor !== valorcambio) {
                    cy.log('Cambio el texto inicial por este: ', valor)
                    cy.wrap(valor).should('not.be.eq', valorcambio)
                } else {
                    cy.log('No cambio de valor')
                    return false
                }
            })
        }), { timeout: 6000, interval: 100, errorMsg: `ERROR NO CAMBIO EL ESTADO DEL Valor: ${valorcambio}` }
    } else if (tipo === 'val') {
        cy.waitUntil(() => {
            return cy.get(locator).invoke('val').then((texto) => {
                valor = texto
                cy.log('Texto que se obtuvo', valor)
                if (valor !== valorcambio) {
                    cy.log('Cambio el valor inicial por este: ', valor)
                    cy.wrap(valor).should('not.be.eq', valorcambio)
                } else {
                    cy.log('No cambio de valor')
                    return false
                }
            })
        }), { timeout: 6000, interval: 100, errorMsg: `ERROR NO CAMBIO EL ESTADO DEL Valor: ${valorcambio}` }
    }
})

Cypress.Commands.add('paginadorSelect', (locator, page) => {//este commando implica esperar a que cargue ciertos elementos
    cy.get(locator).select(page)
})

Cypress.Commands.add('doWaitImport', (integracion, dux) => {
    const query = `select exists(select 1
        from tarea_importacion_pedido_ecommerce t
        where t.id_dux = ${dux}
          and t.tipo = '${integracion}'
          and t.tipo_importacion = 'MANUAL'
          and t.finalizada = 'N');`;//order by id_tarea_importacion_pedido_ecommerce desc

    function checkRecordExists() {
        return cy.task("connectDB", query).then((response) => {
            const exists = response[0].exists;
            return exists;
        });
    }

    cy.waitUntil(() => {
        return checkRecordExists().then(exists => {
            //cy.log(`Estado de la importacion: ${exists}`)
            return !exists;  // Espera hasta que exists sea false
        });
    }, {
        errorMsg: 'Se alcanzo el limite de espera para la importacion',
        timeout: 240000,
        interval: 5000,
    }).then(() => {
        cy.log('Ya se puede Importar');
    });
})

Cypress.Commands.add('doWaitImportPublicacion', (integracion, dux) => {
    const query = `select exists(select 1
        from tarea_importacion_publicaciones t
        where t.id_dux = ${dux}
          and t.tipo = '${integracion}'
          and t.tipo_importacion = 'MANUAL'
          and t.finalizada = 'N');`;//order by tarea_importacion_publicaciones desc

    function checkRecordExists() {
        return cy.task("connectDB", query).then((response) => {
            const exists = response[0].exists;
            return exists;
        });
    }

    cy.waitUntil(() => {
        return checkRecordExists().then(exists => {
            //cy.log(`Estado de la importacion: ${exists}`)
            return !exists;  // Espera hasta que exists sea false
        });
    }, {
        errorMsg: 'Se alcanzo el limite de espera para la importacion',
        timeout: 240000,
        interval: 5000,
    }).then(() => {
        cy.log('Ya se puede Importar');
    });
})