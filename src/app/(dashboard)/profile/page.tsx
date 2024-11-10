'use client'
import { useRouter } from 'next/navigation';
import React, { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '~/trpc/react';

interface pageProps {
  
}

const page: FC<pageProps> = ({  }) => {
  const [stepState, setStepState] = useState({
    showNameStep: true,
    showAboutStep: false,
    showEducationStep: false,
    showExperienceStep: false,
    showSkillsStep: false,
    showSocialLinksStep: false,
    showContactStep: false,
    showSubmitButton: false,
    showPreviousButton: true,
    showNextButton: true,
  });

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = useCallback(() => {
    setCurrentStep((prevStep) => prevStep + 1);
  }, []);

  const previousStep = useCallback(() => {
          
    setCurrentStep((prevStep) => prevStep - 1);
  }, []);

  const updateProfileDetails = api.user.updateUserDetails.useMutation({
    onSuccess: () => {
      toast.success('Profile updated successfully')
    },
  });

  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const onSubmit = useCallback(
    (data:any) => {
      updateProfileDetails.mutate(
        
        {
          name: data.name,
          education: {
            currentcollege: data.currentcollege,
            degree: data.degree,
            fieldofstudy: data.fieldofstudy,
            startDate:data.startDateeducation,
            endDate: data.endDateeducation,
            description: data.descriptionedu,
          },
          experience: {
            company: data.company,
            position: data.position,

            //write end date using dayjs
            startDate: data.startDateexp,
            endDate: data.endDateexp,
            resume: data.resume,
            description: data.descriptionexperience,
          },
          about: {
            description: data.description,
          },
          socialLinks: {
            github: data.github,
            linkedin: data.linkedin,
            twitter: data.twitter,
            instagram: data.instagram,
          },
          skills: data.skills.split(','),
          contact: {
            email: data.email,
            phone: data.phone,
            address: data.address,
          },
        },
        
        {
          onSuccess: () => {
            // console.log('success');
            toast.success('user created')
          },
        }
      );
    },
    [updateProfileDetails]
  );

  const steps = [
    { title: 'Name' },
    { title: 'About' },
    { title: 'Education' },
    { title: 'Experience' },
    { title: 'Skills' },
    { title: 'Social Links' },
    { title: 'Contact' },
  ];

  const { showPreviousButton, showNextButton } = stepState;

  const previousButtonDisabled = currentStep === 0;
  const nextButtonDisabled = currentStep === steps.length - 1;

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-8">Complete Your Profile</h1>
          
          {/* Step indicator */}
          <ul className="steps steps-horizontal w-full mb-8">
            {steps.map((step, index) => (
              <li key={index} className={`step ${index <= currentStep ? 'step-primary' : ''}`}>
                {step.title}
              </li>
            ))}
          </ul>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                {/* Keep existing form fields but wrap them in better styled containers */}
                {currentStep === 0 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('name')} 
                      placeholder="Enter your full name"
                    />
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('description')} 
                      placeholder="Enter a brief description"
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Current College</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('currentcollege')} 
                      placeholder="Enter your current college"
                    />
                    <label className="label">
                      <span className="label-text">Degree</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('degree')} 
                      placeholder="Enter your degree"
                    />
                    <label className="label">
                      <span className="label-text">Field of Study</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('fieldOfStudy')} 
                      placeholder="Enter your field of study"
                    />
                    <label className="label">
                      <span className="label-text">Start Date</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="date" 
                      {...register('startDateeducation')} 
                    />
                    <label className="label">
                      <span className="label-text">End Date</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="date" 
                      {...register('endDateeducation')} 
                    />
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('descriptionedu')} 
                      placeholder="Enter a brief description"
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('company')} 
                      placeholder="Enter your company"
                    />
                    <label className="label">
                      <span className="label-text">Position</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('position')} 
                      placeholder="Enter your position"
                    />
                    <label className="label">
                      <span className="label-text">Start Date</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="date" 
                      {...register('startDateexp')} 
                    />
                    <label className="label">
                      <span className="label-text">End Date</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="date" 
                      {...register('endDateexp')} 
                    />
                    <label className="label">
                      <span className="label-text">Resume</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('resume')} 
                      placeholder="Enter your resume"
                    />
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('descriptionexperience')} 
                      placeholder="Enter a brief description"
                    />
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Skills</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('skills')} 
                      placeholder="Enter your skills"
                    />
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Github</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('github')} 
                      placeholder="Enter your Github profile"
                    />
                    <label className="label">
                      <span className="label-text">Linkedin</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('linkedin')} 
                      placeholder="Enter your Linkedin profile"
                    />
                    <label className="label">
                      <span className="label-text">Twitter</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('twitter')} 
                      placeholder="Enter your Twitter profile"
                    />
                    <label className="label">
                      <span className="label-text">Instagram</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('instagram')} 
                      placeholder="Enter your Instagram profile"
                    />
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('email')} 
                      placeholder="Enter your email"
                    />
                    <label className="label">
                      <span className="label-text">Phone</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('phone')} 
                      placeholder="Enter your phone number"
                    />
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <input 
                      className="input input-bordered"
                      type="text" 
                      {...register('address')} 
                      placeholder="Enter your address"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              {showPreviousButton && (
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={previousStep}
                  disabled={previousButtonDisabled}
                >
                  {previousButtonDisabled ? 'Start' : '← Previous'}
                </button>
              )}

              {showNextButton && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={nextButtonDisabled}
                >
                  {nextButtonDisabled ? 'Review' : 'Next →'}
                </button>
              )}
            </div>

            {currentStep === steps.length - 1 && (
              <button type="submit" className="btn btn-accent btn-block mt-4">
                Save Profile
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default page;