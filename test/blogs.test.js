const Page = require('./helper/page')

beforeEach(async () => {
    const page = await Page.build()
    await page.goto('localhost:3000')
})

afterEach(() => {
    await  page.close()
})




describe('When logged in', () => {
    beforeEach(async () => {
        await page.login()
        await page.click('a.btn-floating')
    })

    test('can see blog create button', () => {
        const label = await page.getContentsOf('form label')
    
        expect(label).toEqual('Blog Title')
    })

    describe('And using valid input', () => {

        beforeEach(async () => {
            await page.type('.title input', 'My Title')
            await page.type('.content input', 'My Content')
            await page.click('form button')
        })

        test('Submitting takes user to review screen', () => { 
            const text = await page.getContentsOf('h5')
            expect(text).toEqual('Please confirm your entries')  
        })

        test('Submitting then saving adds blog to index page', () => {
            await page.click('button.green')
            await page.waitFor('.card')

            const title = await  page.getContentsOf('.card title')
            const content = await page.getContentsOf('p')
            
            expect(title).toEqual('My Title')
            expect(content).toEqual('My Content')
        })
    })

    describe('And using invalid input', () => {

        beforeEach(async () => {
            await page.click('form button')
        })

        test('the form shows error message', () => { 
            const titleError = await getContentsOf('.title .red-text')
            const contentError = await getContentsOf('.content .red-text')

            expect(titleError).toEqual('You must provide a value')
            expect(contentError ).toEqual('You must provide a value')
        })
    })
})

describe('User is not logged in', async () => {
    test('User cannot create blog posts', async () => {
        const result = await page.evaluate(() => {
            return fetch('/api/blogs', {
                method: 'POST',
                credentials: 'same-origin',
                header: {
                  'Content-Type':'application/json'  
                },
                body: JSON.stringify({ title: 'My Title', content:'My Content' })
            }).then(res => res.json())
        })

        expect(result).toEqual({error:'You must log in!'})
    })

    test('User cannot get ad list of posts', async () => {
        const result = await page.evaluate(() => {
            return fetch('/api/blogs', {
                method: 'GET',
                credentials: 'same-origin',
                header: {
                  'Content-Type':'application/json'  
                },
               
            }).then(res => res.json())
        })

        expect(result).toEqual({error:'You must log in!'})
    })

})