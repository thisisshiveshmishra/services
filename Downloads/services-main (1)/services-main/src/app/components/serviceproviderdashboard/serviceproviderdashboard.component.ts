import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';


@Component({
  selector: 'app-serviceproviderdashboard',
  templateUrl: './serviceproviderdashboard.component.html',
  styleUrls: ['./serviceproviderdashboard.component.css']
})
export class ServiceproviderdashboardComponent {

  editForm!: FormGroup;
  selectedFile: File | null = null;
  providerEmail!: string;
  providerId!: number;
  profileImageUrl: string = 'https://bootdey.com/img/Content/avatar/avatar7.png';

  // 🆕 Added for multiple image uploads
  selectedImages: File[] = [];
  selectedImagePreviews: string[] = [];
  uploadedImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceproviderService: ServiceProviderService,
    private router: Router
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

        // Fetch uploaded service images too
        this.fetchUploadedImages();
      },
      (error) => {
        console.error('Error loading provider data', error);
      }
    );
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

  uploadImages() {
  if (!this.selectedImages.length) return;

  const formData = new FormData();
  this.selectedImages.forEach((img) => formData.append('images', img));

  this.serviceproviderService.uploadImages(this.providerId, formData).subscribe(
    () => {
       // ❌ Error handler
      console.error('Error uploading images');
      alert('Error uploading images. Please try again.');
    },
    (error) => {
     
      // ✅ Success handler
      alert('Images uploaded successfully! ✅');  // Show success message
      this.selectedImages = [];                    // Clear file selection
      this.selectedImagePreviews = [];              // Clear preview
      this.refreshPage();             
      this.fetchUploadedImages();                  // Fetch updated list
    }
  );
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
    alert('Profile updated successfully!');
    alert('Please wait till the admin approves the request.');
    this.editForm.markAsPristine(); // ✅ Reset dirty status
    this.router.navigate(['/loginserviceprovider']);
  },
  (err) => console.error('Update failed', err)
);


   

  }

  logout() {
    localStorage.removeItem('providerEmail');
    this.router.navigate(['/loginserviceprovider']);
  }

  refreshPage(): void {
  window.location.reload();
}

}