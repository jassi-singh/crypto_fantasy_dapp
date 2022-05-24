export const axiosInitialParams = {
  baseUrl: 'https://unofficial-cricbuzz.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Host': 'unofficial-cricbuzz.p.rapidapi.com',
    'X-RapidAPI-Key': `${process.env.API_KEY}`,
  },
  withCredentials: true,
}
