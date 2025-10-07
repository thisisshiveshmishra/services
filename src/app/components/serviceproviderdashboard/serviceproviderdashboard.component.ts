// serviceproviderdashboard.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { ServiceProviderService, ImageResponseDTO } from 'src/app/services/service-provider.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
 
export interface UploadedImage {
  id: number | null;
  imageData: string; // Base64 + prefix for <img src>
}
 
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
  uploadedImages: UploadedImage[] = [];
 
  providerMessages: any[] = [];
  groupedMessages: { [userId: string]: any[] } = {};
  showMessageModal = false;
  replies: { [userId: string]: string } = {};
  objectKeys = Object.keys;

   showLocationInput = false;
  storeLocationUrl: string = '';
  savedLocationUrl: string = '';
  addressId: number | null = null;
  locationUrl: string = '';




  
 
  constructor(
    private fb: FormBuilder,
    private serviceproviderService: ServiceProviderService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {}
 
  ngOnInit(): void {

    // 👇 directly load saved address for this provider
  

    this.editForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobileNumber: [''],
      location: [''],
      gender: [''],
      category: [''],
    });
 
    this.providerEmail = localStorage.getItem('providerEmail') || '';
    console.log('Service Provider Email on Ngoninit:',this.providerEmail);
    this.loadProviderByEmail(this.providerEmail);

      // Example: Fetch providerId from localStorage (adjust to your login flow)
    const storedId = localStorage.getItem('providerId');
    if (storedId) {
      this.providerId = Number(storedId);
    }
  }
 
  // Load provider and fetch images/messages
  loadProviderByEmail(email: string) {
    this.serviceproviderService.getProviderByEmail(email).subscribe({
      next: (data) => {
        this.providerId = data.id;
        console.log('Service Provider id from LoadProviderByEmail:',this.providerId);
        this.editForm.patchValue(data);
 
        if (data.profilePicture) {
          this.profileImageUrl = 'data:image/jpeg;base64,' + data.profilePicture;
        }
 
        this.fetchUploadedImages();
        this.fetchProviderMessages();
        this.loadSavedLocation(this.providerId);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading provider data', err);
      }
    });
  }
 
  // Fetch uploaded images
  fetchUploadedImages(): void {
    if (!this.providerId) return;
 
    this.serviceproviderService.getProviderImages(this.providerId).subscribe({
      next: (res: ImageResponseDTO[]) => {
        this.uploadedImages = Array.isArray(res)
          ? res.map((img) => ({
              id: img.imageId ?? null,
              imageData: img.base64Image.startsWith('data:')
                ? img.base64Image
                : `data:image/jpeg;base64,${img.base64Image}`
            }))
          : [];
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching images', err);
        this.uploadedImages = [];
      }
    });
  }
 
  // Select multiple images with 500 KB validation
onMultipleFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];
  this.selectedImages = [];
  this.selectedImagePreviews = [];

  let oversizedFiles: string[] = [];

  for (const file of files) {
    // Check file size (500 * 1024 = 512000 bytes)
    if (file.size > 2000 * 1024) {
      oversizedFiles.push(file.name);
      continue; // Skip this file
    }

    this.selectedImages.push(file);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImagePreviews.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // 🚨 Show alert if oversized files found
  if (oversizedFiles.length > 0) {
    alert(
      `These files exceed 2000 KB and were not added:\n\n${oversizedFiles.join(
        "\n"
      )}`
    );
  }
}

 
  // Upload images
  uploadImages() {
    if (!this.selectedImages.length) {
      alert('Please select at least one image.');
      return;
    }
 
    const formData = new FormData();
    this.selectedImages.forEach(img => formData.append('images', img));
 
    this.serviceproviderService.uploadImages(this.providerId, formData).subscribe({
      next: () => {
        alert('Images uploaded successfully!');
        this.selectedImages = [];
        this.selectedImagePreviews = [];
        this.fetchUploadedImages();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error uploading images', error);
        alert('Error uploading images. Please try again.');
      }
    });
  }
 
  // ✅ Delete image
  deleteImage(imageId: number | null) {
    if (imageId === null || imageId === undefined) {
      alert('Invalid image ID.');
      return;
    }
 
    if (!confirm('Are you sure you want to delete this image?')) return;
 
    this.serviceproviderService.deleteImage(imageId).subscribe({
      next: () => {
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
        alert('Image deleted successfully!');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error deleting image', err);
        alert('Error deleting image');
      }
    });
  }
 
  // ======================= MESSAGES =======================
  fetchProviderMessages() {
    this.messageService.getMessagesByProvider(this.providerId).subscribe({
      next: (data) => {
        this.providerMessages = data || [];
        this.groupedMessages = this.groupMessagesByUser(this.providerMessages);
      },
      error: (err: HttpErrorResponse) => console.error('Error fetching messages', err)
    });
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
 
    const replyObj = { replyContent, replyTime: new Date() };
 
    this.messageService.sendReply(messageId, replyObj).subscribe({
      next: () => {
        alert('Reply sent successfully!');
        this.replies[userId] = '';
        this.fetchProviderMessages();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error sending reply', error);
        alert('Failed to send reply.');
      }
    });
  }
 
  // ======================= PROFILE =======================
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }
 
  onSubmit() {
    const formValues = this.editForm.value;
    const formData = new FormData();
    formData.append('provider', new Blob([JSON.stringify(formValues)], { type: 'application/json' }));
 
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
 
    this.serviceproviderService.updateProvider(this.providerId, formData).subscribe({
      next: () => {
        alert('Profile updated successfully! Please wait for admin approval.');
        this.editForm.markAsPristine();
        this.router.navigate(['/loginserviceprovider']);
      },
      error: (err: HttpErrorResponse) => console.error('Update failed', err)
    });
  }
 
  logout() {
    localStorage.removeItem('providerEmail');
    this.router.navigate(['/loginserviceprovider']);
  }


   toggleLocationInput() {
    this.showLocationInput = !this.showLocationInput;
  }

  saveLocation() {
  if (!this.locationUrl) {
    alert('Please enter a valid location URL');
    return;
  }

  const payload = {
    location_url: this.locationUrl,
    serviceProvider: { id: this.providerId }
  };

  this.serviceproviderService.saveStoreLocation(payload).subscribe({
    next: (res) => {
      this.savedLocationUrl = res.location_url;
      this.addressId = res.id;
      alert('Location saved successfully!');
      this.showLocationInput = false;
    },
    error: (err) => console.error('Error saving location', err)
  });
}

viewLocation() {
  if (!this.savedLocationUrl) {
    alert('No location saved yet!');
    return;
  }
  window.open(this.savedLocationUrl, '_blank');
}


loadSavedLocation(providerId: number) {
  this.serviceproviderService.getAddressByServiceProviderId(providerId).subscribe({
    next: (res) => {
      if (res && res.length > 0) {
        // pick first address (or loop if multiple)
        this.savedLocationUrl = res[0].location_url;
        this.addressId = res[0].id;   // ✅ store address ID
        console.log('Saved Location:', this.savedLocationUrl);
        console.log('Address ID:', this.addressId);
      }
    },
    error: (err) => {
      console.warn('No saved location found for provider', err);
    }
  });
}


deleteLocation() {
  if (!this.addressId) {
    alert('No address found to delete.');
    return;
  }

  if (!confirm('Are you sure you want to delete your saved location?')) {
    return;
  }

  this.serviceproviderService.deleteAddress(this.addressId).subscribe({
    next: () => {
      alert('Location deleted successfully!');
      this.savedLocationUrl = '';
      this.addressId = null;
    },
    error: (err) => {
      console.error('Error deleting location', err);
      alert('Failed to delete location.');
    }
  });
}





}
 
 