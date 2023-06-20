import React from 'react';
import { render } from '@testing-library/react';
import NavbarE from './../Navbar.js';

describe("Testy do generowania Navbara", () => {
    test('render',() => {
        render(<NavbarE />)
    })
})