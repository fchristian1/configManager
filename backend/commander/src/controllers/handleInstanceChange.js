export function handleInstanceChange(services) {

    return async function (change) {
        // Deine Logik für die "users"-Collection
        const data = { _id: change.documentKey?._id ?? "", fields: change.fullDocument ?? change.updateDescription?.updatedFields };

        if (change.operationType == "delete") return Promise.resolve();
        if (change.operationType == "insert") return Promise.resolve();

        //if in change.updateDescription.updatedFields only a field with state, return
        const fieldsInChange = Object.keys(change.updateDescription?.updatedFields ?? {});
        if (fieldsInChange.length == 1 && fieldsInChange[0] == "state") return Promise.resolve();
        if (fieldsInChange.map((field) => field.startsWith("commanderCommand")).length > 0) return Promise.resolve();


        const instance = services.getService("Instances", change.documentKey?._id);
        console.log('🪧  Instance-Änderung erkannt!');

        await instance.loadModules({ data: data?.fields });
    }

} 