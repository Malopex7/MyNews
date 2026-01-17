db.users.updateOne(
    { _id: ObjectId("6969506bb1cbdbceb999c864") },
    { $set: { username: "xolane" } }
);

print("Username updated successfully!");
