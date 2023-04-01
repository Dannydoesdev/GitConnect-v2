import { Container, Grid, SimpleGrid, Skeleton, useMantineTheme, rem } from '@mantine/core';

const PRIMARY_COL_HEIGHT = rem(300);

export function ProfilePageLayoutGrid() {
  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

  return (
    <Container my="md">
      <Grid>

        {/* User info vertical full height span */}
        <Grid.Col span={3}>
          <Skeleton height='100%' radius="md" animate={false} />
        </Grid.Col>

        {/* Remaining width for cover image and projects */}
        <Grid.Col span={9}>  
          <Grid gutter="md">

            {/* Cover Image full grid span */}
            <Grid.Col>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>
            
            {/* Feature project full grid span - selected by user and parsed from DB */}
            <Grid.Col>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>

            {/* Other projects various grid spans */}
            {/* Map projects to this layout */}
            <Grid.Col span={6}>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>

            <Grid.Col span={6}>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>

          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
}