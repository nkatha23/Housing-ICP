import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

const webapp_id = "YOUR_BACKEND_CANISTER_ID"; // Replace with your actual canister ID

const webapp_idl = ({ IDL }) => {
    return IDL.Service({
        getProperties: IDL.Func([], [IDL.Vec(IDL.Record({
            id: IDL.Nat,
            owner: IDL.Principal,
            description: IDL.Text,
            price: IDL.Nat,
        }))], ['query']),
        createProperty: IDL.Func([IDL.Text, IDL.Nat], [], []), // Add function signature for creating a property
        getOwnedTokens: IDL.Func([], [IDL.Vec(IDL.Record({ tokenId: IDL.Nat, propertyId: IDL.Nat }))], ['query']),
    });
};

async function authenticateUser() {
    const authClient = await AuthClient.create();
    const identity = await authClient.login({
        identityProvider: "YOUR_IDENTITY_PROVIDER_URL", // Replace with your identity provider URL
    });

    return identity;
}

async function fetchProperties() {
    const identity = await authenticateUser();
    const agent = new HttpAgent({ identity });
    const webapp = Actor.createActor(webapp_idl, { agent, canisterId: webapp_id });
    
    const properties = await webapp.getProperties();
    const propertyListDiv = document.getElementById("property-list");
    
    properties.forEach(property => {
        const propertyItem = document.createElement("div");
        propertyItem.innerHTML = `<strong>${property.description}</strong> - Price: ${property.price} ARK`;
        propertyListDiv.appendChild(propertyItem);
    });
}

document.getElementById("loginBtn").addEventListener("click", fetchProperties);

document.getElementById("createPropertyForm").onsubmit = async (event) => {
    event.preventDefault();
    
    const description = document.getElementById("description").value;
    const price = parseInt(document.getElementById("price").value);
    
    const identity = await authenticateUser();
    const agent = new HttpAgent({ identity });
    const webapp = Actor.createActor(webapp_idl, { agent, canisterId: webapp_id });
    
    await webapp.createProperty(description, price);
    alert("Property created successfully!");
    // Optionally, refresh the property list
    fetchProperties();
};
