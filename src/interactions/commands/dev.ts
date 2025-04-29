import { ChatInputCommandInteraction, SlashCommandBuilder, Client, AttachmentBuilder } from 'discord.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { ChartConfiguration } from 'chart.js';
import { HourlyChecker } from '../../utils/date';
import { prisma } from '../../prisma';
const width = 800;
const height = 600;

const chartCallback = (ChartJS: any) => {

};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

async function generateChartImage(): Promise<Buffer> {

    const configuration: ChartConfiguration<'line'> = {
        type: 'line',
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [
                {
                    label: 'Dataset A',
                    data: [65, 59, 90, 81, 56, 45, 30, 20, 3, 37],
                    fill: true,
                    borderColor: 'rgba(220,220,220,1)',
                    backgroundColor: 'rgba(220,220,220,0.5)',
                    tension: 0.4,
                },
                {
                    label: 'Dataset B',
                    data: [28, 48, 40, 19, 96, 87, 66, 97, 92, 85],
                    fill: true,
                    borderColor: 'rgba(151,187,205,1)',
                    backgroundColor: 'rgba(151,187,205,0.5)',
                    tension: 0.4,
                }
            ]
        },
        options: {
            animation: false,
            scales: {
                y: {
                    min: 0,
                    max: 200
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
                content: 'Voici ton graphique généré :',
                files: [attachment],
            });
        } catch (error) {
            console.error('Erreur lors de la génération du graphique :', error);
            await interaction.editReply('Une erreur est survenue lors de la génération du graphique.');
        }
    },
};
