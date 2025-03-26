export function handleInstanceChange(services) {

    return function (change) {
        console.log('Instance-Änderung erkannt:', change.documentKey._id, change);
        // Deine Logik für die "users"-Collection
        const data = { _id: change.documentKey?._id, fields: change.fullDocument ?? change.updateDescription?.updatedFields };
        console.log('Instance-Änderung erkannt:', data._id, data.fields);
        if (data.fields["status"]) {
            console.log('Status:', data.fields["status"]);
            if (data.fields["status"] === "Active") {
                // Deine Logik für den Status "active"
                console.log('Status ist "active"');
                (services.getService("Instances", data._id)).loadModules({ data: data.fields });

            } else if (data.fields["status"] === "Inactive") {
                // Deine Logik für den Status "inactive"
                console.log('Status ist "inactive"');
                (services.getService("Instances", data._id)).loadModules({ data: data.fields });
            }
        }
    }
}