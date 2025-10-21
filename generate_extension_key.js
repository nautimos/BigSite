/**
 * Script para gerar Key permanente para extensão Chrome
 * Isso mantém o ID da extensão fixo durante desenvolvimento
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔑 Gerando Key para Extensão Chrome...\n');

try {
    // Caminho para o arquivo .pem (será criado)
    const pemPath = path.join(__dirname, 'extension-key.pem');
    
    // Caminho para o manifest.json
    const manifestPath = path.join(__dirname, 'manifest.json');
    
    // Verificar se openssl está disponível
    try {
        execSync('openssl version', { stdio: 'ignore' });
    } catch (error) {
        console.error('❌ OpenSSL não encontrado!');
        console.log('\n📥 Instale o OpenSSL:');
        console.log('   Windows: https://slproweb.com/products/Win32OpenSSL.html');
        console.log('   Mac: brew install openssl');
        console.log('   Linux: sudo apt-get install openssl\n');
        process.exit(1);
    }
    
    // Gerar chave privada se não existir
    if (!fs.existsSync(pemPath)) {
        console.log('📝 Gerando chave privada...');
        execSync(`openssl genrsa 2048 > "${pemPath}"`, { stdio: 'inherit' });
        console.log('✅ Chave privada gerada: extension-key.pem\n');
    } else {
        console.log('✅ Usando chave existente: extension-key.pem\n');
    }
    
    // Gerar chave pública em formato DER
    console.log('📝 Gerando chave pública...');
    const derPath = path.join(__dirname, 'extension-key.der');
    execSync(`openssl rsa -in "${pemPath}" -pubout -outform DER -out "${derPath}"`, { stdio: 'inherit' });
    
    // Converter para Base64
    const derContent = fs.readFileSync(derPath);
    const base64Key = derContent.toString('base64');
    
    // Limpar arquivo DER temporário
    fs.unlinkSync(derPath);
    
    console.log('\n✅ Key gerada com sucesso!\n');
    console.log('📋 Adicione esta key no manifest.json:\n');
    console.log('─'.repeat(80));
    console.log(`"key": "${base64Key}"`);
    console.log('─'.repeat(80));
    
    // Calcular Extension ID
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(derContent).digest();
    const extensionId = Array.from(hash.slice(0, 16))
        .map(byte => String.fromCharCode(97 + (byte % 26)))
        .join('');
    
    console.log(`\n🆔 Extension ID: ${extensionId}`);
    console.log('\n📝 Use este ID no Google Cloud Console!\n');
    
    // Perguntar se deve atualizar manifest.json automaticamente
    console.log('💡 Dica: Copie a "key" acima e adicione no manifest.json');
    console.log('   Deve ficar logo após o "version":\n');
    console.log('   {');
    console.log('     "manifest_version": 3,');
    console.log('     "name": "Big Site - Motor SEO com IA",');
    console.log('     "version": "1.0.0",');
    console.log(`     "key": "${base64Key}",`);
    console.log('     ...');
    console.log('   }\n');
    
    console.log('⚠️ IMPORTANTE: Guarde o arquivo extension-key.pem em local seguro!');
    console.log('   Você precisará dele para publicar na Chrome Web Store.\n');
    
} catch (error) {
    console.error('❌ Erro ao gerar key:', error.message);
    process.exit(1);
}
