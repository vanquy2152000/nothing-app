import { Box, Container } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from './../common/Loading';
import assets from '../../assets'

const AuthLayout = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth();
    }, [navigate])

    const checkAuth = async () => {
        const isAuth = await authUtils.isAuthenticated()
        if (!isAuth) {
            setLoading(false)
        } else {
            navigate('/')
        }
    }

    return (
        loading ? (
            <Loading fullHeight />
        ) : (
            <Container component='main' maxWidth='xs'>
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <img src={assets.images.logoDark} style={{ width: '100px' }} alt='app logo' />
                    <Outlet />
                </Box>
            </Container>
        )
    )
}

export default AuthLayout