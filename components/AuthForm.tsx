'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import Image from "next/image"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions'

const AuthForm = ({type}: {type: string}) => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    // const loggedInUser = await getLoggedInUser();

    const formSchema = authFormSchema(type)

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    })
    
    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)

        try {
            if (type === 'sign-up') {
                // Sign up user
                const newUser = await signUp(data)
                setUser(newUser)
                console.log('Sign up user', data)
            }
            if (type === 'sign-in') {
                // Sign in user
                const response = await signIn({
                    email: data.email,
                    password: data.password
                })
                if(response) router.push('/')
                console.log('Sign in user', data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        
        
    }

  return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link href='/' className='cursor-pointer items-center flex gap-1'>
                <Image src='/icons/logo.svg' width={34} height={34} alt='Horizon logo' />
                <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
            </Link>
            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                    {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    <p className='text-16 font-normal text-gray-600'>
                        {user ? 'Link your account to get started' : 'Veuillez entrer vos coordonnées.'}
                    </p>
                </h1>
            </div>
        </header>
        {user ? (
            <div className='flex flex-col gap-4'>
                {/* PlaidLink */}
            </div>
        ): (
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {type === 'sign-up' && (
                            <>
                                <div className='flex gap-4'>
                                    <CustomInput control={form.control} name='firstName' label='Prénom' placeholder='ex: John' type='text' />
                                    <CustomInput control={form.control} name='lastName' label='Nom' placeholder='ex: Doe' type='text' />
                                </div>
                                <CustomInput control={form.control} name='address1' label='Adresse' placeholder='Entrez votre adresse postale' type='text' />
                                <CustomInput control={form.control} name='city' label='Ville' placeholder='Entrez votre ville' type='text' />
                                <div className='flex gap-4'>
                                    <CustomInput control={form.control} name='state' label='Région' placeholder='ex: ARA' type='text' />
                                    <CustomInput control={form.control} name='postalCode' label='Code postal' placeholder='ex: 69001' type='number' />
                                </div>
                                <div className='flex gap-4'>
                                    <CustomInput control={form.control} name='dateOfBirth' label='Date de naissance' placeholder='yyyy-mm-dd' type='date' />
                                    <CustomInput control={form.control} name='ssn' label='SSN' placeholder='ex: 1234' type='number' />
                                </div>
                            </>
                        )}
                        <CustomInput control={form.control} name='email' label='Email' placeholder='Entrez votre email' type='email' />

                        <CustomInput control={form.control} name='password' label='Password' placeholder='Entrez votre mot de passe' type='password' />
                        
                        <div className='flex flex-col gap-4'>
                            <Button type="submit" className='form-btn' disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
                                    </>
                                ) : type === 'sign-in' ? 'Connectez vous' : 'Inscrivez-vous'}
                            </Button>
                        </div>
                    </form>
                </Form>

                <footer className='flex justify-center gap-1'>
                    <p className='text-14 font-normal text-gray-600'>{type === 'sign-in' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ? "}</p>
                    <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                        {type === 'sign-in' ? 'Inscrivez-vous' : 'Connectez vous'}
                    </Link>
                </footer>
            </>
        )}
    </section>
  )
}

export default AuthForm