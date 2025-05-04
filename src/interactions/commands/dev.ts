import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    Client,
    AttachmentBuilder
  } from 'discord.js';
  
  import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
  import type { ChartConfiguration } from 'chart.js';
  import { format, subHours } from 'date-fns';
  import { prisma } from '../../prisma';
  
  const width = 800;
  const height = 600;
  
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    chartCallback: (ChartJS) => {
      
    },
    backgroundColour: 'black' 
  });
  
  async function generateChartImage(): Promise<Buffer> {
    const now = new Date();
    const start = subHours(now, 23); 
    const labels: string[] = Array.from({ length: 24 }, (_, i) =>
      format(subHours(now, 23 - i), 'HH:00')
    );
  
    const vibrantColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#00FF00', '#FF00FF',
      '#00FFFF', '#FF4444'
    ];
  
    const servers = await prisma.serverMcConfig.findMany({
      include: {
        playerByHours: {
          where: {
            createdAt: {
              gte: subHours(now, 24)
            }
          }
        }
      }
    });
  
    const datasets = servers.map((server, index) => {
      const playerMap = new Map<string, number>();
  
      server.playerByHours.forEach(entry => {
        const hour = format(entry.createdAt, 'HH:00');
        playerMap.set(hour, entry.player);
      });
  
      const data = labels.map(label => playerMap.get(label) ?? 0);
      const color = vibrantColors[index % vibrantColors.length];
  
      return {
        label: server.name,
        data,
        fill: true,
        borderColor: color,
        backgroundColor: color + '33',
        tension: 0.4,
      };
    });
  
    const configuration: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        animation: false,
        plugins: {
          title: {
            display: true,
            text: 'Statistiques de joueurs par heure (24h)',
            color: 'white',
          },
          legend: {
            labels: {
              color: 'white'
            }
          }
        },
        scales: {
          y: {
            min: 0,
            title: {
              display: true,
              text: 'Nombre de joueurs',
              color: 'white'
            },
            ticks: {
              color: 'white'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Heures',
              color: 'white'
            },
            ticks: {
              color: 'white'
            }
          }
        }
      }
    };
  
    return await chartJSNodeCanvas.renderToBuffer(configuration);
  }
  
  export default {
    data: new SlashCommandBuilder()
      .setName('dev')
      .setDescription('Command pour développer le bot'),
  
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
      await interaction.deferReply();
  
      try {
        const imageBuffer = await generateChartImage();
        const attachment = new AttachmentBuilder(imageBuffer, { name: 'chart.png' });
  
        await interaction.editReply({
          content: 'Voici le graphique des joueurs par heure pour chaque serveur Minecraft :',
          files: [attachment],
        });
      } catch (error) {
        console.error('Erreur lors de la génération du graphique :', error);
        await interaction.editReply('Une erreur est survenue lors de la génération du graphique.');
      }
    },
  };
  