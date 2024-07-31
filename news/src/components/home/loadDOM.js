import axios from 'axios';
async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    // const response = await axios.get(`http://localhost:8080/rss?url=${encodeURIComponent(url)}`);

    return response.data;
  } catch (error) {
    return null;
  }
}
export async function fetchRss(url) {
  try {
    const response = await axios.get(url);
    // const response = await axios.get(`http://localhost:8080/rssFeed?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
export default fetchHTML ;