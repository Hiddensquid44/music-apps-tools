import { Injectable } from '@angular/core';
import { Playlist } from '../../models/playlist';
import { LoginData } from '../../../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }

  public async searchPlaylists(query: string): Promise<Playlist[] | null> {
    const limit = 5;
    return new Promise<Playlist[] | null>((resolve) => {
       this.http.get<any>(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}`,
      this.getOptions()
    ).subscribe({
          next: (response) => {
            resolve(response?.items);
          },
          error: (error) => {
            console.error('Error retrieving current playing track:', error);
            resolve(null);
          }
        });
    });
  }
  
}
