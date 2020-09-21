import { Injectable } from '@nestjs/common';
import Axios, { AxiosResponse } from 'axios';
import FormData = require('form-data');

@Injectable()
export class UploadImageService {
  uploadImage(image: string): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('image', image);
    return Axios({
      method: 'post',
      url:
        'https://api.imgbb.com/1/upload?key=96370f6b88cfde1ea6a16a5d0d13bb0f',
      data: formData,
      headers: { ...formData.getHeaders() },
    }).catch(err => err);
  }
}

/*
@Injectable()
export class UploadImageService {
  uploadImage(image: string): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('image', image);
    return Axios({
      method: 'post',
      url:
        'https://api.imgbb.com/1/upload?key=96370f6b88cfde1ea6a16a5d0d13bb0f',
      data: formData,
      headers: { ...formData.getHeaders() },
    })
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }
}
*/
