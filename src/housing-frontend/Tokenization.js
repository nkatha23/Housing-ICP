async function fetchOwnedTokens() {
    const identity = await authenticateUser();
    const agent = new HttpAgent({ identity });
    const webapp = Actor.createActor(webapp_idl, { agent, canisterId: webapp_id });
    
    const tokens = await webapp.getOwnedTokens();
    const ownedTokensDiv = document.getElementById("owned-tokens");
    
    tokens.forEach(token => {
        const tokenItem = document.createElement("div");
        tokenItem.innerHTML = `Token ID: ${token.tokenId}, Property ID: ${token.propertyId}`;
        ownedTokensDiv.appendChild(tokenItem);
    });
}

document.addEventListener("DOMContentLoaded", fetchOwnedTokens);
