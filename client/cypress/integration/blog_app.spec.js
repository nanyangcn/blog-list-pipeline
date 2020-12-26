describe('blog list app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      username: 'username',
      name: 'User',
      password: 'password',
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3001')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('username')
      cy.get('#password').type('password')
      cy.get('#loginButton').click()

      cy.contains('Logout')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('username')
      cy.get('#password').type('wrong')
      cy.get('#loginButton').click()

      cy.contains('Invalid username or password.')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'username', password: 'password' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#inputTitle').type('Title')
      cy.get('#inputAuthor').type('Author')
      cy.get('#inputUrl').type('url')
      cy.get('#createButton').click()
      cy.contains('a blog Title by Author added')
    })
  })

  describe('When blog is created', function () {
    beforeEach(function () {
      cy.login({ username: 'username', password: 'password' })
      cy.createBlog({
        title: 'Title1',
        author: 'Author',
        url: 'url',
        likes: 0,
      })
      cy.contains('Title1').click()
    })

    it('User can like blog', function () {
      cy.contains('0 likes')
      cy.get('#likeButton').click()
      cy.contains('1 likes')
    })

    it('User can remove a blog created by themselves', function () {
      cy.get('#removeButton').click()
      cy.contains('blog deleted')
      cy.should('not.contain', 'Title Author')
    })

    it('User cannot delete blog created by others', function () {
      const user = {
        username: 'user1',
        name: 'User1',
        password: 'password1',
      }
      cy.request('POST', 'http://localhost:3001/api/users', user)
      cy.get('#logoutButton').click()
      cy.get('#username').type('user1')
      cy.get('#password').type('password1')
      cy.get('#loginButton').click()

      cy.contains('url')
      cy.should('not.contain', 'remove')
    })
  })

  describe('check if blogs are sorted by likes', function () {
    beforeEach(function () {
      cy.login({ username: 'username', password: 'password' })
      cy.createBlog({
        title: 'Title1',
        author: 'Author1',
        url: 'url1',
        likes: 34,
      })
      cy.createBlog({
        title: 'Title2',
        author: 'Author2',
        url: 'url2',
        likes: 23,
      })
      cy.createBlog({
        title: 'Title3',
        author: 'Author3',
        url: 'url3',
        likes: 265,
      })
    })

    it('checks 3 titles', function () {
      cy.get('.likes').then(function (response) {
        const a = parseInt(response[0].textContent)
        const b = parseInt(response[1].textContent)
        const c = parseInt(response[2].textContent)
        const condition = a > b && b > c
        expect(condition).to.eq(true)
      })
    })
  })
})
