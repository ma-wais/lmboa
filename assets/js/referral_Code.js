if (currentData['parent_id'] != "0") {
    const parentRef = doc(db, "users", currentData['parent_id']);
    const parentSnap = await getDoc(parentRef);

    if (parentSnap.exists()) {
        const parentData = parentSnap.data();
        let parentAmount = parseFloat(parentData['amount']) + (parseFloat(formDataObject['amount']) * 0.10);
        await updateDoc(parentRef, {
            amount: parentAmount
        });
        console.log("parent found, 10% awarded")
        if (parentData['parent_id'] != "0") {
            const grandParentRef = doc(db, "users", parentData['parent_id']);
            const grandParentSnap = await getDoc(grandParentRef);

            if (grandParentSnap.exists()) {
                const grandParentData = grandParentSnap.data();
                let grandParentAmount = parseFloat(grandParentData['amount']) + (parseFloat(formDataObject['amount']) * 0.07);
                await updateDoc(grandParentRef, {
                    amount: grandParentAmount
                });
                console.log("grand parent found, 7% awarded")
                if (grandParentData['parent_id'] != "0") {
                    const greatGrandParentRef = doc(db, "users", grandParentData['parent_id']);
                    const greatGrandParentSnap = await getDoc(greatGrandParentRef);

                    if (greatGrandParentSnap.exists()) {
                        const greatGrandParentData = greatGrandParentSnap.data();
                        let greatGrandParentAmount = parseFloat(greatGrandParentData['amount']) + (parseFloat(formDataObject['amount']) * 0.03);
                        await updateDoc(greatGrandParentRef, {
                            amount: greatGrandParentAmount
                        });
                        console.log("great grand parent found, 3% awarded")
                        window.location.reload();
                    } else {
                        console.log("No such document!");
                        window.location.reload();
                    }
                }
            } else {
                console.log("No such document!");
                window.location.reload();
            }
        }
    } else {
        console.log("No such document!");
        window.location.reload();
    }
} else {
    window.location.reload();
}