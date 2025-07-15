import axios from 'axios';

const getService = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data.body;
  } catch (error) {
  throw error;
  }
};

export default getService