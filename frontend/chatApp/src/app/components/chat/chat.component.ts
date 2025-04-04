import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout'
import { Apollo } from 'apollo-angular';
import { Messages, messages, sendMessage, userDetails } from './graphqlChat';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  users: any[] = [];
  messages: any[] = [];
  error: any;
  loading: boolean = true;
  userId: any = sessionStorage.getItem('id');
  receiverId!: any;
  receiverName!: string;
  userDetails: any;

  constructor(private apollo: Apollo, private dataService: DataServiceService) { }

  ngOnInit(): void {
    // this.subscribeToNewPost();
    this.dataService.receiver.subscribe(data => {
      if (this.userId != 0 && data.id != 0) {
        this.fetchUserDetails(Number(data.id));
        this.fetchMessages(Number(this.userId), Number(data.id), data.name)
      }
    }
    );
    this.dataService.receiver.subscribe(data => {
      this.receiverId = data.id;
      if (this.userId != 0 && data.id != 0) {
        this.subscribeToNewPost(Number(this.userId), Number(data.id))
      }
    }
    );
  }

  fetchUserDetails(receiverId: number) {
    this.apollo.watchQuery({
      query: userDetails,
      variables: {
        receiverId
      }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (error) {
        // console.error("Error fetching users:", error);
      } else {
        console.log(data);

        this.userDetails = data.userDetails;
      }
    });
  }

  sendMessage(content: string) {
    console.log(this.receiverId);
    this.apollo.mutate({
      mutation: sendMessage,
      variables: {
        content: content,
        userId: Number(this.userId),
        receiverId: Number(this.receiverId)
      }
    }).subscribe(response => {
      console.log('Message sent:', response);
    }, error => {
      console.error('Error sending message:', error);
    });
  }

  fetchMessages(sender: number, receiver: number, name: string) {
    this.receiverName = name;
    this.apollo.watchQuery({
      query: messages,
      variables: {
        sender, receiver
      }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        this.messages = data.messages
      }
    });
  }

  subscribeToNewPost(sender: number, receiver: number) {
    this.apollo.subscribe({
      query: Messages,
      variables: { userId: sender, receiverId: receiver }
    }).subscribe(({ data }: any) => {
      if (data && data.Messages) {
        console.log("New user received:", data.Messages);
        this.messages = [...this.messages, data.Messages]; // Append new user to the list
      }
    }, error => {
      console.error("Subscription error:", error);
    });
  }
}
