import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor HomeOwnership {
    type Ownership = {
        owner: Principal,
        propertyId: Text,
        tokenId: Text
    };

    private stable var tokens: [Ownership] = [];

    public shared(msg) func issueToken(propertyId: Text, tokenId: Text) : async Text {
        let caller = msg.caller;
        let token = { owner = caller; propertyId = propertyId; tokenId = tokenId };
        tokens := Array.append(tokens, [token]);
        return "Token issued successfully!";
    };

    public query func getOwner(tokenId: Text) : async ?Principal {
        for (token in tokens) {
            if (token.tokenId == tokenId) {
                return ?token.owner;
            };
        };
        return null;
    };
};
