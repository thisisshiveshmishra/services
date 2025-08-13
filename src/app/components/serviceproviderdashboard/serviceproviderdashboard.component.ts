import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

@Component({
  selector: 'app-serviceproviderdashboard',
  templateUrl: './serviceproviderdashboard.component.html',
  styleUrls: ['./serviceproviderdashboard.component.css']
})
export class ServiceproviderdashboardComponent implements OnInit {
  editForm!: FormGroup;
  selectedFile: File | null = null;
  providerEmail!: string;
  providerId!: number;
  profileImageUrl: string = 'https://bootdey.com/img/Content/avatar/avatar7.png';

  selectedImages: File[] = [];
  selectedImagePreviews: string[] = [];
  uploadedImages: string[] = [];

  providerMessages: any[] = [];
  groupedMessages: { [userId: string]: any[] } = {};
  showMessageModal = false;
  replies: { [userId: string]: string } = {};
  objectKeys = Object.keys; // For ngFor over object keys

  constructor(
    private fb: FormBuilder,
    private serviceproviderService: ServiceProviderService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobileNumber: [''],
      location: [''],
      gender: [''],
      category: [''],
    });

    this.providerEmail = localStorage.getItem('providerEmail')!;
    this.loadProviderByEmail(this.providerEmail);
  }

  loadProviderByEmail(email: string) {
    this.serviceproviderService.getProviderByEmail(email).subscribe(
      (data) => {
        this.providerId = data.id;
        this.editForm.patchValue(data);
        if (data.profilePicture) {
          this.profileImageUrl = 'data:image/jpeg;base64,' + data.profilePicture;
        }
        this.fetchUploadedImages();
        this.fetchProviderMessages();
      },
      (error) => console.error('Error loading provider data', error)
    );
  }

  fetchProviderMessages() {
    // Important: Ensure your MessageService calls new backend API returning DTO with user info
    this.messageService.getMessagesByProvider(this.providerId).subscribe(
      (data) => {
        this.providerMessages = data || [];
        this.groupedMessages = this.groupMessagesByUser(this.providerMessages);
      },
      (error) => console.error('Error fetching messages', error)
    );
  }

  groupMessagesByUser(messages: any[]) {
    const grouped: { [key: string]: any[] } = {};
    if (!messages) return grouped;
    messages.forEach((msg) => {
      const uid = msg.userId?.toString() ?? '';
      if (uid) {
        if (!grouped[uid]) grouped[uid] = [];
        grouped[uid].push(msg);
      }
    });
    return grouped;
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files?.[0] ?? null;
  }

  onMultipleFilesSelected(event: any) {
    this.selectedImages = Array.from(event.target.files || []);
    this.selectedImagePreviews = [];
    for (let file of this.selectedImages) {
      const reader = new FileReader();
      reader.onload = () => this.selectedImagePreviews.push(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  // uploadImages() {
  //   if (!this.selectedImages.length) return;
  //   const formData = new FormData();
  //   this.selectedImages.forEach((img) => formData.append('images', img));
  //   this.serviceproviderService.uploadImages(this.providerId, formData).subscribe(
  //     () => {
  //       alert('Images uploaded successfully!');
  //       this.selectedImages = [];
  //       this.selectedImagePreviews = [];
  //       this.fetchUploadedImages();
  //     },
  //     (error) => {
  //       console.error('Error uploading images', error);
  //       alert('Error uploading images. Please try again.');
  //     }
  //   );
  // }

  uploadImages() {
  if (!this.selectedImages || this.selectedImages.length === 0) {
    alert('Please select at least one image to upload.');
    return;
  }
 
  const formData = new FormData();
  this.selectedImages.forEach((img) => formData.append('images', img));
 
  this.serviceproviderService.uploadImages(this.providerId, formData, { responseType: 'text' })
    .subscribe({
      next: (res: any) => {
        console.log('Upload response:', res);
        alert('Images uploaded successfully!');
        this.selectedImages = [];
        this.selectedImagePreviews = [];
        this.fetchUploadedImages();
      },
      error: (error) => {
        console.error('Error uploading images', error);
 
        // If backend still returns text but with error status
        if (error.status === 200 || error.statusText === 'OK') {
          alert('Images uploaded successfully!');
          this.selectedImages = [];
          this.selectedImagePreviews = [];
          this.fetchUploadedImages();
        } else {
          alert('Error uploading images. Please try again.');
        }
      }
    });
}

  fetchUploadedImages() {
    this.serviceproviderService.getImages(this.providerId).subscribe(
      (images) => (this.uploadedImages = images),
      (error) => console.error('Error fetching images', error)
    );
  }

  onSubmit() {
    const formValues = this.editForm.value;
    const formData = new FormData();
    formData.append(
      'provider',
      new Blob([JSON.stringify(formValues)], { type: 'application/json' })
    );
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.serviceproviderService.updateProvider(this.providerId, formData).subscribe(
      () => {
        alert('Profile updated successfully! Please wait for admin approval.');
        this.editForm.markAsPristine();
        this.router.navigate(['/loginserviceprovider']);
      },
      (err) => console.error('Update failed', err)
    );
  }

  logout() {
    localStorage.removeItem('providerEmail');
    this.router.navigate(['/loginserviceprovider']);
  }

  toggleMessageModal() {
    this.showMessageModal = !this.showMessageModal;
  }

  sendReplyToUser(userId: string) {
    const replyContent = (this.replies[userId] || '').trim();
    if (!replyContent) {
      alert('Please type a reply before sending.');
      return;
    }

    const userMessages = this.groupedMessages[userId];
    if (!userMessages?.length) return;
    const latestMessage = userMessages[userMessages.length - 1];
    const messageId = latestMessage.id;

    const replyObj = {
      replyContent: replyContent,
      replyTime: new Date()
    };

    this.messageService.sendReply(messageId, replyObj).subscribe(
      () => {
        alert('Reply sent successfully!');
        this.replies[userId] = '';
        this.fetchProviderMessages();
      },
      (error) => {
        console.error('Error sending reply', error);
        alert('Failed to send reply. Please try again.');
      }
    );
  }
}
