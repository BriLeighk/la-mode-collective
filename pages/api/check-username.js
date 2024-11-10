export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username } = req.body;

        // Example logic to check if the username is unique
        // Replace this with actual database logic
        const isUnique = await checkUsernameInDatabase(username);

        res.status(200).json({ isUnique });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Mock function to simulate database check
async function checkUsernameInDatabase(username) {
    // Replace with actual database logic
    const existingUsernames = ['user1', 'user2', 'user3'];
    return !existingUsernames.includes(username);
} 