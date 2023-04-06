describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    cy.createUser({ username: 'masa', name: 'Matti Meikäläinen', password: 'salainen' })
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.contains('username')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('masa')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()
      cy.contains('Matti Meikäläinen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('masa')
      cy.get('#password').type('vaara')
      cy.get('#loginButton').click()
      cy.contains('Login')
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })


    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'masa', password: 'salainen' })
      })

      it('A blog can be created', function() {
        cy.get('#createNewButton').click()
        cy.get('#title').type('testiblogi')
        cy.get('#author').type('Testaaja')
        cy.get('#url').type('www.testi.fi')
        cy.get('#submitButton').click()
        cy.get('.success')
          .should('contain', 'a new blog testiblogi by Testaaja added')
          .should('have.css', 'color', 'rgb(0, 128, 0)')
        cy.get('#basicInfo')
          .should('contain', 'testiblogi')
          .should('contain', 'Testaaja')
      })

      describe('When blog has been added', function() {
        beforeEach(function() {
          cy.createBlog({ title: 'ensimmäinen blogi', author: 'Ensimmäinen', url: 'www.ensimmainenblogi.fi' })
          cy.createBlog({ title: 'toinen blogi', author: 'Toinen', url: 'www.toinenblogi.fi' })
          cy.createBlog({ title: 'kolmas blogi', author: 'Kolmas', url: 'www.kolmasblogi.fi' })
        })

        it('A blog can be liked', function() {
          cy.get('#showAdditionalInfoButton').click()
          cy.get('#additionalInfo')
            .should('contain', 'likes: 0')
          cy.get('#likeButton').click()
          cy.get('#additionalInfo')
            .should('contain', 'likes: 1')
        })

        it('A blog can be removed by user who added it', function() {
          cy.contains('ensimmäinen blogi')
          cy.get('#showAdditionalInfoButton').click()
          cy.get('#removeButton').click()
          cy.get('.success').should('contain', 'blog was succesfully removed')
          cy.contains('ensimmäinen blogi').should('not.exist')
        })

        it('A blog cant be removed by user who did not add it', function() {
          cy.createUser({ username: 'erityyppi', name: 'Joku Muu', password: 'salasana' })
          cy.login({ username: 'erityyppi', password: 'salasana' })
          cy.get('#showAdditionalInfoButton').click()
          cy.get('#removeButton').should('not.exist')
        })

        it('A blog with most likes is shown first', function() {
          cy.get('.blogStyle').first()
            .should('contain', 'ensimmäinen blogi')
            .should('contain', 'likes: 0')
            .should('not.contain', 'kolmas blogi')
          cy.contains('kolmas blogi').parent()
            .contains('view').click()
          cy.contains('kolmas blogi').parent()
            .contains('like').click()
          cy.visit('http://localhost:3000')
          cy.get('.blogStyle').first()
            .should('contain', 'kolmas blogi')
            .should('contain', 'likes: 1')
            .should('not.contain', 'ensimmäinen blogi')
        })
      })
    })
  })
})