// server/api/deezer.js
export default defineEventHandler(async (event) => {
    const query = getQuery(event).q; // Valeur par défaut

    const deezerUrl = `${query}`

    try {
        const response = await $fetch(deezerUrl)

        return response
    } catch (error) {
        console.error('Erreur API Deezer:', error)
        throw createError({
            statusCode: 500,
            message: 'Impossible de récupérer les données Deezer'
        })
    }
})