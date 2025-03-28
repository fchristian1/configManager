export function handleInstanceChange(services) {

    return async function (change) {
        console.log('Instance-Änderung erkannt:', change);
        // Deine Logik für die "users"-Collection
        const data = { _id: change.documentKey?._id ?? "", fields: change.fullDocument ?? change.updateDescription?.updatedFields };
        console.log('Instance-Änderung erkannt:', JSON.stringify(data?._id), JSON.stringify(data?.fields));
        if (change.operationType == "delete") return;
        if (change.operationType == "insert") return;
        const instance = services.getService("Instances", data?._id)
        console.log('Instance-Änderung erkannt:', JSON.stringify(instance));
        await instance.loadModules({ data: data?.fields });
    }
}