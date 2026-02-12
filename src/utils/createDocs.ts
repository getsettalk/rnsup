import fs from 'fs-extra';
import path from 'path';

export async function createDocs() {
  const filePath = path.join(process.cwd(), 'RNSUP.md');

  const content = `
# RNSUP Project Guide

## What RNSUP Did
This project was configured using RNSUP CLI.

RNSUP automatically:
- Installed navigation
- Configured reanimated
- Setup alias imports
- Added axios API client
- Added responsive utilities
- Added image import support

## Folder Structure

src/
  components/
  features/
  services/
  store/
  utils/
  hooks/
  theme/
  types/

## Alias Usage

Instead of:
import Button from '../../../components/Button'

Use:
import Button from '@components/Button'

## Responsive Usage

import { widthPercentageToDP as wp } from '@utils/responsive-screen';

<View style={{ width: wp(80) }} />

## API Usage

import api from '@services/api/client';

const users = await api.get('/users');

## Image Import

import logo from '@assets/logo.png';

<Image source={logo} />

`;

  await fs.writeFile(filePath, content.trim());
}