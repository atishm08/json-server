/// <reference types="cypress" />

describe('Network Request', () => {

    let message = "unable to find comment."

    beforeEach(() => {
        cy.visit("https://example.cypress.io/commands/network-requests")
    });

    // Mocking GET response

    it('GET Request', () => {
        cy.intercept({
            method: "GET",
            url: "**/comments/*",
        },
        {
            body: {
                postId: 1,
                id: 1,
                name: "Atish Meshram",
                email: "atish@example.com",
                body: "Hello to everyone from here. This data has been mocked via intercept of cypress."
            }
        }
        ).as("getComment");

        cy.get(".network-btn").click();

        cy.wait("@getComment").its("response.statusCode").should("eql", 200);
    });

    it.only('POST Request', () => {
        cy.intercept("POST", "/comments").as("postComment");

        cy.get(".network-post").click()

        cy.wait("@postComment").should(({ request, response }) => {
            console.log(request);

            expect(request.body).to.include("email");

            console.log(response);

            expect(response.body).to.have.property("name", "Using POST in cy.intercept()");

            expect(response.headers).to.have.property("content-type");
            expect(request.headers).to.have.property("origin", "https://example.cypress.io");

        })

    });

    it.only('PUT Request', () => {
        cy.intercept({
            method: "PUT",
            url: "**/comments/*"
        },
        {
            statusCode: 404,
            body: {
                error: message
            },
            delay: 500
        }).as("putComment")

        cy.get(".network-put").click();

        cy.wait("@putComment")

        cy.get('.network-put-comment').should("contain", message)

    });

});
