import axios from 'axios';

export const exportWord = async (data: any) => {
  const response = await axios.post(
    'https://asia-southeast1-hoabanmaiedu-mobile.cloudfunctions.net/generateDocx',
    data,
  );
  return response.data.url as string;
};
