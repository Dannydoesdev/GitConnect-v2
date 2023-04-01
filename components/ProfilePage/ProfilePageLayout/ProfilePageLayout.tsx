import { Container, Grid, SimpleGrid, Skeleton, useMantineTheme, rem } from '@mantine/core';

const PRIMARY_COL_HEIGHT = rem(300);

type ProfileProps = {
  bio: string,
  projects: any,
  coverImage: string,
}

// accept bio info, cover image and projects - then transfer them into respective places
export function ProfilePageLayoutGrid({ bio, projects, coverImage }: ProfileProps) {

  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

  const containerBreakPoints = ['1913px', '1200px', '1040px', '600px'];

  // Container sizes -

  // BH breakpoints = 1913px, 1200px, 1040px, 600px
  // Behance Profile page (full width) = 2086px
  // BH Profile info (left hand side) = 360px box (300px content)
  // BH Profile info - full width at 2nd last breakpoints - moves to top
  // BH profile project grid (full width 4 proj) = 1686px
  // BH individual project = 404px full size - then scales to fill remaining width at diff col spans
  // BH profile page -
  // Behance Project width - 1400px
  // Behance action widget width - 45px

  // Grid breakpoints should follow the above


  return (
    <Container fluid my="md">
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