const Page = require('./helper/page')

let page

beforeEach(() => {
    page =  await Page.build()

    await page.goto('localhost:3000')
})

afterEach(async () => {
    await page.close()
})

test('correct logo', async () => {
    
    const text = await getContentsOf('a.brand-logo')

    expect(text).toEqual('Blogster')
})

test('click login and starts oauth flow', async () => {
    await page.click('.right a')
    const url = await page.url()

    expect(url).toMatch(/account\.google\.com/)
})

test('when signed in, shows log out button', async () => {
    await page.login()

    const text = await getContentsOf('a[href="/auth/logout"]')

    expect(text).toEqual('Logout')
})
